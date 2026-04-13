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

// Minimum plan required for each feature
export const FEATURE_REQUIRED_PLAN: Record<Feature, Plan> = {
  'enhance-mode': 'pro',
  'linkedin-mode': 'ultimate',
  'job-tailor': 'ultimate',
  'extra-templates': 'pro',
  'dynamic-ats': 'pro',
  'ai-summary': 'pro',
  'ai-bullets': 'basic',
  'skills-finder': 'pro',
  'style-colors': 'pro',
  'download-pdf': 'basic',
  'resume-sharing': 'free', // Allowed for all
  'analytics': 'free',      // Allowed for all
  'cover-letter': 'pro',
  'interview-prep': 'ultimate',
  'expert-review': 'ultimate',
};

export const FEATURE_LABELS: Record<Feature, string> = {
  'enhance-mode': 'Resume Import',
  'linkedin-mode': 'LinkedIn Import',
  'job-tailor': 'Job Tailoring',
  'extra-templates': 'Premium Templates',
  'dynamic-ats': 'Dynamic ATS Score',
  'ai-summary': 'AI Summary Writer',
  'ai-bullets': 'AI Bullet Writer',
  'skills-finder': 'Skills Finder',
  'style-colors': 'Style Customization',
  'download-pdf': 'Download PDF',
  'resume-sharing': 'Resume Sharing',
  'analytics': 'Analytics',
  'cover-letter': 'Cover Letter Generator',
  'interview-prep': 'AI Interview Prep',
  'expert-review': 'Expert Review',
};

// Plan hierarchy for easy comparison
export const PLAN_RANK: Record<Plan, number> = {
  'free': 0,
  'basic': 1,
  'pro': 2,
  'ultimate': 3,
};

export const MAX_RESUMES: Record<Plan, number> = {
  free: 1,
  basic: 1,
  pro: 3,
  ultimate: 10,
};

export const PLAN_PRICES: Record<Exclude<Plan, 'free'>, { monthly: number; annualMonthly: number }> = {
  basic: { monthly: 199, annualMonthly: 159 },
  pro: { monthly: 599, annualMonthly: 479 },
  ultimate: { monthly: 999, annualMonthly: 799 },
};

export const BASIC_BULLET_LIMIT = 3;

// AI generation quota feature keys (match server-side QuotaFeatureKey)
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

export const QUOTA_FEATURE_LABELS: Record<QuotaFeatureKey, string> = {
  generateBullets: 'Bullet Generator',
  generateSummary: 'Summary Writer',
  rephrase: 'Rephrase',
  atsScore: 'ATS Score',
  tailorResume: 'Resume Tailoring',
  smartFit: 'Smart Fit',
  coverLetter: 'Cover Letter',
  interviewPrep: 'Interview Prep',
  findSkills: 'Skills Finder',
  generateFullResume: 'Resume Generator',
};

// Daily generation limits per plan (null = unlimited)
export const DAILY_LIMITS: Record<Plan, Record<QuotaFeatureKey, number> | null> = {
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

export const FONT_OPTIONS = [
  { label: 'EB Garamond — Classic Serif',        value: '"EB Garamond", Georgia, serif' },
  { label: 'Libre Baskerville — Traditional',     value: '"Libre Baskerville", Georgia, serif' },
  { label: 'Merriweather — Readable Serif',       value: '"Merriweather", Georgia, serif' },
  { label: 'Crimson Pro — Editorial',             value: '"Crimson Pro", Georgia, serif' },
  { label: 'Cormorant Garamond — Executive',      value: '"Cormorant Garamond", Georgia, serif' },
  { label: 'Playfair Display — Elegant',          value: '"Playfair Display", Georgia, serif' },
  { label: 'Georgia — Classic',                   value: 'Georgia, "Times New Roman", serif' },
  { label: 'Inter — Modern Sans',                 value: '"Inter", system-ui, sans-serif' },
  { label: 'DM Sans — Clean',                     value: '"DM Sans", system-ui, sans-serif' },
  { label: 'Montserrat — Bold Geometric',         value: '"Montserrat", system-ui, sans-serif' },
  { label: 'Raleway — Slim Geometric',            value: '"Raleway", system-ui, sans-serif' },
  { label: 'Josefin Sans — Minimal',              value: '"Josefin Sans", system-ui, sans-serif' },
  { label: 'Poppins — Friendly',                  value: '"Poppins", system-ui, sans-serif' },
  { label: 'Source Sans 3 — Neutral',             value: '"Source Sans 3", system-ui, sans-serif' },
];
