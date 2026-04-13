export type QuotaFeatureKey =
  | 'generateBullets'
  | 'generateSummary'
  | 'rephrase'
  | 'atsScore'
  | 'tailorResume'
  | 'smartFit'
  | 'coverLetter'
  | 'interviewPrep'
  | 'findSkills'
  | 'generateFullResume';

export type PlanTier = 'free' | 'basic' | 'pro' | 'ultimate';

// null means unlimited (Ultimate plan)
export const DAILY_LIMITS: Record<PlanTier, Record<QuotaFeatureKey, number> | null> = {
  free: {
    generateBullets: 3,
    generateSummary: 1,
    rephrase: 3,
    atsScore: 1,
    tailorResume: 1,
    smartFit: 1,
    coverLetter: 1,
    interviewPrep: 1,
    findSkills: 2,
    generateFullResume: 1,
  },
  basic: {
    generateBullets: 10,
    generateSummary: 5,
    rephrase: 15,
    atsScore: 3,
    tailorResume: 3,
    smartFit: 3,
    coverLetter: 2,
    interviewPrep: 2,
    findSkills: 5,
    generateFullResume: 2,
  },
  pro: {
    generateBullets: 30,
    generateSummary: 15,
    rephrase: 50,
    atsScore: 10,
    tailorResume: 10,
    smartFit: 10,
    coverLetter: 5,
    interviewPrep: 5,
    findSkills: 15,
    generateFullResume: 5,
  },
  ultimate: null,
};

export const ALL_FEATURE_KEYS: QuotaFeatureKey[] = [
  'generateBullets',
  'generateSummary',
  'rephrase',
  'atsScore',
  'tailorResume',
  'smartFit',
  'coverLetter',
  'interviewPrep',
  'findSkills',
  'generateFullResume',
];

export const EMPTY_USAGE: Record<QuotaFeatureKey, number> = {
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
