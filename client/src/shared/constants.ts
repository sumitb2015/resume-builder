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
