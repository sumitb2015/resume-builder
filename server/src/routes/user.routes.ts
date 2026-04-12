import { Router } from 'express';
import { db } from '../lib/firebase-admin';

const router = Router();

// Sync user profile with Firestore (create if doesn't exist)
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized. Please ensure FIREBASE_SERVICE_ACCOUNT is set.' });
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
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized.' });
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

// Request Expert Review
router.post('/request-review', async (req, res) => {
  try {
    const { userId, resumeId, resumeData, comments } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized.' });
    }

    const reviewRequest = {
      userId,
      resumeId: resumeId || 'temp',
      resumeData: resumeData || {},
      comments: comments || '',
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await db.collection('expert_reviews').add(reviewRequest);
    
    // ADMIN NOTIFICATION LOG (Point 6)
    console.log(`[ADMIN NOTIFY] New Expert Review Request! 
      User: ${userId}
      Resume: ${resumeId}
      ID: ${docRef.id}
      Time: ${new Date().toISOString()}`);

    res.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Expert Review Request Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save ATS Score History (Point 6)
router.post('/ats-history', async (req, res) => {
  try {
    const { userId, resumeId, score, jobTitle, company } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized.' });
    }

    const historyEntry = {
      userId,
      resumeId: resumeId || 'temp',
      score,
      jobTitle: jobTitle || 'Unknown Position',
      company: company || 'Unknown Company',
      createdAt: new Date(),
    };

    const docRef = await db.collection('ats_history').add(historyEntry);
    res.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('ATS History Save Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
