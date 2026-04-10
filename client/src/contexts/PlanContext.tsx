import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

export type Plan = 'free' | 'basic' | 'pro' | 'ultimate';

export type Feature =
  | 'enhance-mode'
  | 'linkedin-mode'
  | 'extra-templates'
  | 'dynamic-ats'
  | 'ai-summary'
  | 'ai-bullets'
  | 'skills-finder'
  | 'style-colors'
  | 'job-tailor'
  | 'download-pdf'
  | 'resume-sharing'
  | 'analytics'
  | 'cover-letter'
  | 'interview-prep'
  | 'expert-review';

const PLAN_FEATURES: Record<Plan, Feature[]> = {
  free: ['resume-sharing', 'analytics'],
  basic: ['ai-bullets', 'download-pdf', 'resume-sharing', 'analytics'],
  pro: [
    'enhance-mode', 'extra-templates', 'dynamic-ats', 'ai-summary', 
    'ai-bullets', 'skills-finder', 'style-colors', 'download-pdf',
    'resume-sharing', 'analytics', 'cover-letter'
  ],
  ultimate: [
    'enhance-mode', 'linkedin-mode', 'extra-templates', 'dynamic-ats',
    'ai-summary', 'ai-bullets', 'skills-finder', 'style-colors', 'job-tailor',
    'download-pdf', 'resume-sharing', 'analytics', 'cover-letter',
    'interview-prep', 'expert-review'
  ],
};

const BASIC_BULLET_LIMIT = 3;

export const MAX_RESUMES: Record<Plan, number> = {
  free: 1,
  basic: 1,
  pro: 3,
  ultimate: 10,
};

interface PlanContextType {
  plan: Plan | null;
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

  const [bulletData, setBulletData] = useState<{ date: string; count: number }>(() => {
    return { date: todayKey(), count: 0 };
  });

  const fetchPlanFromDb = async (userId: string) => {
    try {
      const profile: any = await api.getUserProfile(userId);
      const dbPlan = profile.plan || 'free';
      const expiresAt = profile.expiresAt ? new Date(profile.expiresAt._seconds ? profile.expiresAt._seconds * 1000 : profile.expiresAt) : null;
      const now = new Date();

      if (expiresAt && now > expiresAt) {
        // Plan expired -> revert to free
        setPlanState('free');
        localStorage.setItem(`bespokecv_plan_${userId}`, 'free');
      } else {
        setPlanState(dbPlan as Plan);
        localStorage.setItem(`bespokecv_plan_${userId}`, dbPlan);
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      // Even on error, if we don't have a plan yet, default to free
      setPlanState(prev => prev || 'free');
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

  const maxResumes = plan ? MAX_RESUMES[plan] : 0;

  return (
    <PlanContext.Provider value={{ plan, setPlan, updatePlan, canAccess, remainingBullets, incrementBulletUsage, maxResumes }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
