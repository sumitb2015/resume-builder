import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from '../lib/firebase-admin';

dotenv.config();

const router = Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Create Order
router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
    }
    const { amount, currency, receipt, notes, userId, planTier, isAnnual } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        ...(notes || {}),
        userId: userId || '',
        planTier: planTier || '',
        isAnnual: isAnnual ? 'true' : 'false',
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create Razorpay order' });
  }
});

// Verify Signature (Synchronous)
router.post('/verify', async (req, res) => {
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
router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Webhook] Signature mismatch');
      return res.status(400).send('Invalid signature');
    }
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
        
        await db.collection('users').doc(userId).update({
          plan: planTier,
          updatedAt: new Date(),
          expiresAt: expiresAt
        });
        
        console.log(`[Webhook] Success for user ${userId}`);
      } else {
        console.warn('[Webhook] Missing userId, planTier or database initialization in event payload');
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[Webhook] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
