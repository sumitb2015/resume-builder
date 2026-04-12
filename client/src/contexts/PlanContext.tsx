import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import { 
  type Plan, 
  type Feature, 
  FEATURE_REQUIRED_PLAN, 
  PLAN_RANK,
  MAX_RESUMES, 
  BASIC_BULLET_LIMIT 
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
}

const PlanContext = createContext<PlanContextType | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? null;

  const planKey = uid ? `bespokecv_plan_${uid}` : null;
  const bulletKey = uid ? `bespokecv_bullets_${uid}` : null;

  const [plan, setPlanState] = useState<Plan | null>(null);
  const [expiresAtState, setExpiresAtState] = useState<Date | null>(null);

  const [bulletData, setBulletData] = useState<{ date: string; count: number }>(() => {
    return { date: todayKey(), count: 0 };
  });

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

  // When the user changes (login/logout), reload plan and bullet data
  useEffect(() => {
    if (!uid) {
      setPlanState(null);
      setExpiresAtState(null);
      setBulletData({ date: todayKey(), count: 0 });
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
          return;
        }
      }
    } catch { /* ignore */ }
    setBulletData({ date: todayKey(), count: 0 });
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

  return (
    <PlanContext.Provider value={{ plan, expiresAt: expiresAtState, setPlan, updatePlan, canAccess, remainingBullets, incrementBulletUsage, maxResumes }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
