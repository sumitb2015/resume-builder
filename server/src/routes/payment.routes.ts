import { Router, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from '../lib/firebase-admin';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

dotenv.config();

const router = Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID.trim(),
      key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
    })
  : null;

// Pricing Map (Source of Truth)
const PLAN_PRICES: Record<string, { monthly: number; annualMonthly: number }> = {
  basic: { monthly: 199, annualMonthly: 159 },
  pro: { monthly: 599, annualMonthly: 479 },
  ultimate: { monthly: 999, annualMonthly: 799 },
};

// Helper to validate and return discount percentage
// Fix 5: Clamp parsed value to [0, 100] — a value >100 would produce a negative charge amount.
const getDiscountPercentage = (code?: string): number => {
  if (!code) return 0;

  const discountCodesEnv = process.env.DISCOUNT_CODES || ""; // Format: SUMMER20:20,WELCOME50:50
  const pairs = discountCodesEnv.split(",").map(p => p.trim());

  for (const pair of pairs) {
    const [name, percent] = pair.split(":");
    if (name && percent && name.toUpperCase() === code.toUpperCase()) {
      const parsed = parseInt(percent, 10) || 0;
      return Math.max(0, Math.min(100, parsed));
    }
  }

  return 0;
};

// Validate Discount Code Endpoint
router.post('/validate-discount', authenticate, (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  const discount = getDiscountPercentage(code);
  
  if (discount > 0) {
    res.json({ valid: true, discountPercent: discount });
  } else {
    res.json({ valid: false, discountPercent: 0, message: "Invalid or expired discount code" });
  }
});

// Create Order
router.post('/create-order', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
    }
    
    const { currency, receipt, notes, userId, planTier, isAnnual, discountCode } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify User ID matches the authenticated user
    if (req.user?.uid !== userId) {
      return res.status(403).json({ error: 'Forbidden: User ID mismatch' });
    }

    if (!planTier || !PLAN_PRICES[planTier.toLowerCase()]) {
      return res.status(400).json({ error: 'Invalid plan tier selected.' });
    }

    const tier = planTier.toLowerCase();
    const pricing = PLAN_PRICES[tier];
    
    // Calculate base amount
    let baseAmount = isAnnual ? pricing.annualMonthly * 12 : pricing.monthly;
    
    // Apply discount if any
    const discountPercent = getDiscountPercentage(discountCode);
    const finalAmount = Math.round(baseAmount * (1 - discountPercent / 100));
    const finalAmountPaise = Math.floor(finalAmount * 100);

    const options: any = {
      amount: finalAmountPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        ...(notes || {}),
        userId: userId || 'unknown',
        planTier: planTier || 'unknown',
        isAnnual: isAnnual === true || isAnnual === 'true',
      },
    };

    if (discountCode) {
      options.notes.discountCode = discountCode;
      options.notes.discountPercent = discountPercent.toString();
    }

    console.log('[Razorpay] Creating order with options:', JSON.stringify(options, null, 2));

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    // Serialize the error for better frontend debugging
    const errorMessage = 
      error?.error?.description || 
      error?.description || 
      error?.message || 
      (typeof error === 'object' ? JSON.stringify(error) : String(error)) || 
      'Failed to create Razorpay order';
      
    res.status(500).json({ error: errorMessage });
  }
});

// Verify Signature (Synchronous)
router.post('/verify', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planTier,
      userId,
      isAnnual
    } = req.body;

    console.log(`[Payment Verify] START - User: ${userId}, Plan: ${planTier}`);

    if (!userId || !planTier) {
      console.error('[Payment Verify] Missing userId or planTier in request body');
      return res.status(400).json({ success: false, message: 'Missing userId or planTier' });
    }

    // Verify User ID matches the authenticated user
    if (req.user?.uid !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: User ID mismatch' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error(`[Payment Verify] Signature mismatch for User: ${userId}`);
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    console.log(`[Payment Verify] Signature matched for User: ${userId}`);

    if (!db) {
      console.error('[Payment Verify] Database not initialized!');
      return res.status(500).json({ success: false, message: 'Database initialization error' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (isAnnual ? 365 : 30));

    console.log(`[Payment Verify] Attempting DB update for User: ${userId} to Plan: ${planTier}`);
    
    try {
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      
      if (!doc.exists) {
         console.error(`[Payment Verify] User document ${userId} NOT FOUND. Creating one...`);
         await userRef.set({
           uid: userId,
           plan: planTier,
           createdAt: new Date(),
           updatedAt: new Date(),
           expiresAt: expiresAt
         }, { merge: true });
      } else {
        await userRef.update({
          plan: planTier,
          updatedAt: new Date(),
          expiresAt: expiresAt
        });
      }
      
      console.log(`[Payment Verify] Database update SUCCESS for User: ${userId}`);
      return res.json({ success: true, message: 'Payment verified and plan updated' });
    } catch (dbErr: any) {
      console.error(`[Payment Verify] Database update FAILED for User: ${userId}:`, dbErr);
      return res.status(500).json({ success: false, message: `Database update failed: ${dbErr.message}` });
    }
  } catch (error: any) {
    console.error('[Payment Verify] Unexpected error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Webhook (Asynchronous)
// Fix 4: Webhook secret is now MANDATORY. Previously `if (secret && signature)` silently
// skipped verification when RAZORPAY_WEBHOOK_SECRET was unset — a critical payment fraud vector.
router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured. Rejecting all webhook requests.');
    return res.status(500).send('Webhook secret not configured on server.');
  }

  const signature = req.headers['x-razorpay-signature'] as string;
  if (!signature) {
    console.error('[Webhook] Missing x-razorpay-signature header');
    return res.status(400).send('Missing signature');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('[Webhook] Signature mismatch — possible spoofed request');
    return res.status(400).send('Invalid signature');
  }

  try {
    const event = req.body;
    console.log(`[Webhook] Received event: ${event.event}`);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const entity = event.payload.payment ? event.payload.payment.entity : event.payload.order.entity;

      // Notes are stored in different places depending on whether it's a payment or order entity
      const notes = entity.notes || {};
      const userId = notes.userId;
      const planTier = notes.planTier;
      const isAnnual = notes.isAnnual === 'true';

      if (userId && planTier && db) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (isAnnual ? 365 : 30));

        console.log(`[Webhook] Updating plan for user ${userId} to ${planTier}`);

        await db.collection('users').doc(userId).set({
          plan: planTier,
          updatedAt: new Date(),
          expiresAt: expiresAt
        }, { merge: true });

        console.log(`[Webhook] Success for user ${userId}`);
      } else {
        console.warn('[Webhook] Missing userId, planTier or database initialization in event payload');
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[Webhook] Error:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
