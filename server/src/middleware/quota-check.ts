import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { db } from '../lib/firebase-admin';
import { DAILY_LIMITS, EMPTY_USAGE, QuotaFeatureKey, PlanTier } from '../constants/quotas';

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowUTCMidnight(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export function quotaCheck(featureKey: QuotaFeatureKey) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const uid = req.user?.uid;

    // If auth missing or DB unavailable, let request through
    if (!uid || !db) return next();

    try {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) return next();

      const userData = userDoc.data()!;
      const plan = (userData.plan || 'free') as PlanTier;

      // Ultimate plan — unlimited, skip all checks
      if (plan === 'ultimate' || DAILY_LIMITS[plan] === null) return next();

      const limits = DAILY_LIMITS[plan]!;
      const today = todayUTC();
      let dailyUsage = userData.dailyUsage as (Record<string, any> & { date?: string }) | undefined;

      // Lazy reset when date changes
      if (!dailyUsage || dailyUsage.date !== today) {
        dailyUsage = { date: today, ...EMPTY_USAGE };
        await userRef.update({ dailyUsage });
      }

      const currentCount: number = (dailyUsage[featureKey] as number) ?? 0;
      const limit = limits[featureKey];

      if (currentCount >= limit) {
        return res.status(429).json({
          error: 'QUOTA_EXCEEDED',
          feature: featureKey,
          remaining: 0,
          resetAt: tomorrowUTCMidnight(),
        });
      }

      // Increment usage count after a successful response
      res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            await userRef.update({
              [`dailyUsage.${featureKey}`]: currentCount + 1,
              'dailyUsage.date': today,
            });
          } catch (err) {
            console.error('[quota] Failed to increment usage:', err);
          }
        }
      });

      next();
    } catch (err) {
      // On unexpected error, let the request through rather than blocking the user
      console.error('[quota] Error in quota check:', err);
      next();
    }
  };
}
