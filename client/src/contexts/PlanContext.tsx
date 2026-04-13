import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import {
  type Plan,
  type Feature,
  type QuotaFeatureKey,
  FEATURE_REQUIRED_PLAN,
  PLAN_RANK,
  MAX_RESUMES,
  BASIC_BULLET_LIMIT,
  DAILY_LIMITS,
} from '../shared/constants';

interface PlanContextType {
  plan: Plan | null;
  expiresAt: Date | null;
  setPlan: (plan: Plan) => void;
  updatePlan: () => Promise<void>;
  canAccess: (feature: Feature) => boolean;
  remainingBullets: number;
  incrementBulletUsage: () => void;
  maxResumes: number;
  dailyUsage: Record<QuotaFeatureKey, number>;
  getRemainingUses: (feature: QuotaFeatureKey) => number | null;
  incrementLocalUsage: (feature: QuotaFeatureKey) => void;
  refreshUsage: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

const EMPTY_USAGE: Record<QuotaFeatureKey, number> = {
  generateBullets: 0,
  generateSummary: 0,
  rephrase: 0,
  atsScore: 0,
  tailorResume: 0,
  smartFit: 0,
  coverLetter: 0,
  interviewPrep: 0,
  findSkills: 0,
  generateFullResume: 0,
};

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? null;

  const planKey = uid ? `bespokecv_plan_${uid}` : null;
  const bulletKey = uid ? `bespokecv_bullets_${uid}` : null;
  const usageKey = uid ? `bespokecv_usage_${uid}` : null;

  const [plan, setPlanState] = useState<Plan | null>(null);
  const [expiresAtState, setExpiresAtState] = useState<Date | null>(null);

  const [bulletData, setBulletData] = useState<{ date: string; count: number }>(() => {
    return { date: todayKey(), count: 0 };
  });

  const [dailyUsage, setDailyUsage] = useState<Record<QuotaFeatureKey, number>>(EMPTY_USAGE);

  const fetchPlanFromDb = async (userId: string) => {
    try {
      const profile: any = await api.getUserProfile(userId);
      const dbPlan = profile.plan || 'free';
      const expiresAt = profile.expiresAt ? new Date(profile.expiresAt._seconds ? profile.expiresAt._seconds * 1000 : profile.expiresAt) : null;
      const now = new Date();

      let finalPlan: Plan = dbPlan as Plan;
      if (expiresAt && now > expiresAt) {
        // Plan expired -> revert to free
        finalPlan = 'free';
      }
      
      setPlanState(finalPlan);
      setExpiresAtState(expiresAt);
      localStorage.setItem(`bespokecv_plan_${userId}`, finalPlan);
    } catch (err) {
      console.error('Failed to fetch plan from database:', err);
      // DO NOT overwrite with 'free' here if we already have a state (like from localStorage)
      // This prevents the UI from flickering to 'Free' if the network is flaky
      setPlanState(prev => {
        if (prev) return prev;
        return 'free';
      });
    }
  };

  const updatePlan = async () => {
    if (uid) {
      await fetchPlanFromDb(uid);
    }
  };

  const refreshUsage = async () => {
    if (!uid) return;
    try {
      const data = await api.getUserUsage();
      const today = todayKey();
      if (data.date === today) {
        const merged = { ...EMPTY_USAGE, ...data.usage } as Record<QuotaFeatureKey, number>;
        setDailyUsage(merged);
        if (usageKey) {
          localStorage.setItem(usageKey, JSON.stringify({ date: today, usage: merged }));
        }
      }
    } catch {
      // silently ignore — localStorage values remain valid
    }
  };

  // When the user changes (login/logout), reload plan, bullet data, and daily usage
  useEffect(() => {
    if (!uid) {
      setPlanState(null);
      setExpiresAtState(null);
      setBulletData({ date: todayKey(), count: 0 });
      setDailyUsage(EMPTY_USAGE);
      return;
    }

    // 1. Try to load cached plan for immediate UI response
    const storedPlan = localStorage.getItem(`bespokecv_plan_${uid}`) as Plan | null;
    if (storedPlan) setPlanState(storedPlan);

    // 2. Fetch official plan from database
    fetchPlanFromDb(uid);

    const bKey = `bespokecv_bullets_${uid}`;
    try {
      const stored = localStorage.getItem(bKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayKey()) {
          setBulletData(parsed);
        }
      }
    } catch { /* ignore */ }

    // 3. Load daily usage from localStorage first (instant), then sync from server
    const uKey = `bespokecv_usage_${uid}`;
    try {
      const stored = localStorage.getItem(uKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayKey()) {
          setDailyUsage({ ...EMPTY_USAGE, ...parsed.usage });
        }
      }
    } catch { /* ignore */ }

    // Sync from Firestore in background (no await — instant localStorage already shown)
    api.getUserUsage().then(data => {
      const today = todayKey();
      if (data.date === today) {
        const merged = { ...EMPTY_USAGE, ...data.usage } as Record<QuotaFeatureKey, number>;
        setDailyUsage(merged);
        localStorage.setItem(uKey, JSON.stringify({ date: today, usage: merged }));
      }
    }).catch(() => { /* silently ignore */ });
  }, [uid]);

  // Cross-tab plan sync: when the user upgrades in another tab, this tab picks it up via the storage event
  useEffect(() => {
    if (!uid) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `bespokecv_plan_${uid}` && e.newValue) {
        setPlanState(e.newValue as Plan);
        // Re-fetch from DB to get the canonical plan (expiry, etc.)
        fetchPlanFromDb(uid);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [uid]);

  const setPlan = (newPlan: Plan) => {
    if (planKey) localStorage.setItem(planKey, newPlan);
    setPlanState(newPlan);
  };

  const canAccess = (feature: Feature): boolean => {
    if (!plan) return false;
    const required = FEATURE_REQUIRED_PLAN[feature];
    return PLAN_RANK[plan] >= PLAN_RANK[required];
  };

  const remainingBullets: number = (() => {
    if (!plan) return 0;
    if (plan !== 'basic') return Infinity;
    const today = todayKey();
    const used = bulletData.date === today ? bulletData.count : 0;
    return Math.max(0, BASIC_BULLET_LIMIT - used);
  })();

  const incrementBulletUsage = () => {
    if (plan !== 'basic' || !bulletKey) return;
    const today = todayKey();
    const current = bulletData.date === today ? bulletData.count : 0;
    const next = { date: today, count: current + 1 };
    localStorage.setItem(bulletKey, JSON.stringify(next));
    setBulletData(next);
  };

  const maxResumes = plan ? MAX_RESUMES[plan] : 0;

  // Returns remaining generations for a feature; null = unlimited (Ultimate plan or plan not yet loaded)
  const getRemainingUses = (feature: QuotaFeatureKey): number | null => {
    if (!plan) return null; // plan not yet loaded — treat as unlimited to avoid flash-locked state
    const limits = DAILY_LIMITS[plan];
    if (limits === null) return null; // unlimited (Ultimate)
    const limit = limits[feature];
    const used = dailyUsage[feature] ?? 0;
    return Math.max(0, limit - used);
  };

  // Optimistic increment — called after a successful API call
  const incrementLocalUsage = (feature: QuotaFeatureKey) => {
    if (!uid || !plan) return;
    const limits = DAILY_LIMITS[plan];
    if (limits === null) return; // unlimited, nothing to track

    setDailyUsage(prev => {
      const next = { ...prev, [feature]: (prev[feature] ?? 0) + 1 };
      if (usageKey) {
        localStorage.setItem(usageKey, JSON.stringify({ date: todayKey(), usage: next }));
      }
      return next;
    });
  };

  return (
    <PlanContext.Provider value={{
      plan,
      expiresAt: expiresAtState,
      setPlan,
      updatePlan,
      canAccess,
      remainingBullets,
      incrementBulletUsage,
      maxResumes,
      dailyUsage,
      getRemainingUses,
      incrementLocalUsage,
      refreshUsage,
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
