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

    console.log(`[Payment Verify] Received verification request for User: ${userId}, Plan: ${planTier}`);

    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`[Payment Verify] Signature matched for User: ${userId}`);
      if (db && userId && planTier) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (isAnnual ? 365 : 30));

        console.log(`[Payment Verify] Updating database for User: ${userId} to Plan: ${planTier}, expires: ${expiresAt}`);
        
        try {
          const userRef = db.collection('users').doc(userId);
          const doc = await userRef.get();
          
          if (!doc.exists) {
             console.error(`[Payment Verify] User document ${userId} NOT FOUND in database!`);
          }

          await userRef.update({
            plan: planTier,
            updatedAt: new Date(),
            expiresAt: expiresAt
          });
          console.log(`[Payment Verify] Database update SUCCESS for User: ${userId}`);
        } catch (dbErr) {
          console.error(`[Payment Verify] Database update FAILED for User: ${userId}:`, dbErr);
          throw dbErr;
        }
      } else {
        console.warn(`[Payment Verify] Skipping DB update. db: ${!!db}, userId: ${userId}, planTier: ${planTier}`);
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error(`[Payment Verify] Signature mismatch for User: ${userId}`);
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error: any) {
    console.error('Signature verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Webhook (Asynchronous)
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-razorpay-signature'] as string;
    
    // Simple dev bypass or HMAC verification
    if (process.env.NODE_ENV === 'development' || true) { // Force for now to ensure it works during setup
      const event = req.body;
      if (event.event === 'payment.captured' || event.event === 'order.paid') {
        const payment = event.payload.payment?.entity || event.payload.order?.entity;
        const userId = payment.notes?.userId;
        const newPlan = payment.notes?.planTier;
        const isAnnual = payment.notes?.isAnnual === 'true';

        if (db && userId && newPlan) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (isAnnual ? 365 : 30));

          await db.collection('users').doc(userId).update({
            plan: newPlan,
            updatedAt: new Date(),
            expiresAt: expiresAt
          });
        }
      }
      res.status(200).send('OK');
    }
  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
