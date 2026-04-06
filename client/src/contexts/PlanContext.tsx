import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export type Plan = 'basic' | 'pro' | 'ultimate';

export type Feature =
  | 'enhance-mode'
  | 'linkedin-mode'
  | 'extra-templates'
  | 'dynamic-ats'
  | 'ai-summary'
  | 'ai-bullets'
  | 'skills-finder'
  | 'style-colors'
  | 'job-tailor';

const PLAN_FEATURES: Record<Plan, Feature[]> = {
  basic: ['ai-bullets'],
  pro: ['extra-templates', 'dynamic-ats', 'ai-summary', 'ai-bullets', 'skills-finder', 'style-colors'],
  ultimate: [
    'enhance-mode', 'linkedin-mode', 'extra-templates', 'dynamic-ats',
    'ai-summary', 'ai-bullets', 'skills-finder', 'style-colors', 'job-tailor',
  ],
};

const BASIC_BULLET_LIMIT = 3;

interface PlanContextType {
  plan: Plan | null;
  setPlan: (plan: Plan) => void;
  canAccess: (feature: Feature) => boolean;
  remainingBullets: number;
  incrementBulletUsage: () => void;
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

  const [plan, setPlanState] = useState<Plan | null>(() => {
    if (!planKey) return null;
    return (localStorage.getItem(planKey) as Plan | null);
  });

  const [bulletData, setBulletData] = useState<{ date: string; count: number }>(() => {
    if (!bulletKey) return { date: todayKey(), count: 0 };
    try {
      const stored = localStorage.getItem(bulletKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Reset if it's a new day
        if (parsed.date === todayKey()) return parsed;
      }
    } catch { /* ignore */ }
    return { date: todayKey(), count: 0 };
  });

  // When the user changes (login/logout), reload plan and bullet data from localStorage
  useEffect(() => {
    if (!uid) {
      setPlanState(null);
      setBulletData({ date: todayKey(), count: 0 });
      return;
    }
    const storedPlan = localStorage.getItem(`bespokecv_plan_${uid}`) as Plan | null;
    setPlanState(storedPlan);

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

  const setPlan = (newPlan: Plan) => {
    if (planKey) localStorage.setItem(planKey, newPlan);
    setPlanState(newPlan);
  };

  const canAccess = (feature: Feature): boolean => {
    if (!plan) return false;
    return PLAN_FEATURES[plan].includes(feature);
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

  return (
    <PlanContext.Provider value={{ plan, setPlan, canAccess, remainingBullets, incrementBulletUsage }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
