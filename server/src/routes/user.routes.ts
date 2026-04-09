import { Router } from 'express';
import { db } from '../lib/firebase-admin';

const router = Router();

// Sync user profile with Firestore (create if doesn't exist)
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    
    if (!uid || !db) {
      return res.status(400).json({ error: 'UID and database initialization required' });
    }

    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      const now = new Date();
      // 'free' plan doesn't expire, other plans will have an expiry set on payment
      
      const newUser = {
        uid,
        email: email || '',
        displayName: displayName || '',
        plan: 'free',
        createdAt: now,
        updatedAt: now,
        expiresAt: null, // Perpetual free tier
      };
      await userRef.set(newUser);
      return res.json(newUser);
    }

    res.json(doc.data());
  } catch (error: any) {
    console.error('User Sync Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch user profile from Firestore
router.get('/me/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid || !db) {
      return res.status(400).json({ error: 'UID required' });
    }

    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(doc.data());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
