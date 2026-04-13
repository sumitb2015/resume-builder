import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import * as aiService from './services/ai.service';
import parseRoutes from './routes/parse.routes';
import exportRoutes from './routes/export.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import { authenticate, AuthRequest } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const isDev = process.env.NODE_ENV === 'development';

// Helper: never leak raw error.message to the client in production
function serverError(res: Response, error: any, fallback = 'An unexpected error occurred. Please try again.') {
  const message = isDev ? (error?.message ?? String(error)) : fallback;
  return res.status(500).json({ error: message });
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://bespokecv.in',
  'https://www.bespokecv.in',
  'https://api.bespokecv.in',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // In production, reject requests with no Origin (e.g. curl, server-to-server without auth).
    // In development, allow them so tools like Postman and local scripts work unimpeded.
    if (!origin) {
      if (isDev) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
    if (
      allowedOrigins.includes(origin) ||
      /\.(vercel\.app|onrender\.com)$/.test(origin) ||
      /bespokecv\.in$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Fix 3: Reduced from 50mb to 1mb — prevents trivial DoS via large JSON bodies.
// Note: file uploads go through multer (memoryStorage) and are unaffected by this limit.
app.use(express.json({ limit: '1mb' }));

app.use('/api/parse', authenticate, parseRoutes);
app.use('/api/export', authenticate, exportRoutes);
app.use('/api/payment', paymentRoutes); // authentication handled inside payment router to exclude webhook
app.use('/api/user', userRoutes);
app.use('/api/ai', authenticate);

// Fix 2: Per-user rate limiter on all AI endpoints (keyed by Firebase UID or IP fallback).
// 20 AI requests per minute is generous for normal use but blocks automated abuse.
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req: any) => req.user?.uid || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});
app.use('/api/ai', aiRateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

import { z } from 'zod';

// Fix 7: Replaced z.any() and .passthrough() with z.record(z.unknown()).
// This still accepts any key/value inside each section (required for flexibility)
// but rejects unknown TOP-LEVEL keys and prevents completely untyped blobs.
const ResumeSchema = z.object({
  personal: z.record(z.unknown()).optional(),
  experience: z.array(z.record(z.unknown())).optional(),
  education: z.array(z.record(z.unknown())).optional(),
  skills: z.array(z.record(z.unknown())).optional(),
  projects: z.array(z.record(z.unknown())).optional(),
  certifications: z.array(z.record(z.unknown())).optional(),
  languages: z.array(z.record(z.unknown())).optional(),
  customSections: z.array(z.record(z.unknown())).optional(),
});

const generateBulletsSchema = z.object({
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
});

const generateSummarySchema = z.object({
  name: z.string().max(200).optional(),
  title: z.string().min(1).max(200),
  experience: z.string().min(1).max(500),
  skills: z.array(z.string().max(100)).max(50).optional(),
});

const tailorResumeSchema = z.object({
  resume: ResumeSchema,
  jobDescription: z.string().min(10, 'Job description is too short').max(20000),
});

const atsScoreSchema = z.object({
  resume: ResumeSchema,
  jobDescription: z.string().min(10).max(20000),
});

const atsTailorSchema = z.object({
  resume: ResumeSchema,
  jobDescription: z.string().min(10).max(20000),
  atsResult: z.record(z.unknown()),
});

const findSkillsSchema = z.object({
  jobTitle: z.string().min(1).max(200),
});

const smartFitSchema = z.object({
  resume: ResumeSchema,
  config: z.record(z.unknown()),
  targetPages: z.number().min(1).max(5),
  userPrompt: z.string().max(1000).optional(),
});

const rephraseSchema = z.object({
  text: z.string().min(1).max(5000),
  instruction: z.string().max(500).optional(),
});

const generateFullResumeSchema = z.object({
  targetRole: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
  experience: z.string().min(1).max(500),
  currentRole: z.string().max(200).optional(),
  context: z.string().max(2000).optional(),
  education: z.string().max(1000).optional(),
  achievements: z.string().max(2000).optional(),
});

// Fix 8: SSRF protection helpers for fetch-job-url
const ALLOWED_URL_PATTERN = /^https?:\/\//i;
const BLOCKED_HOSTS = /^(localhost|127\.|10\.|192\.168\.|::1|0\.0\.0\.0|169\.254\.)/i;

function validateExternalUrl(url: unknown): { valid: true; href: string } | { valid: false; error: string } {
  if (!url || typeof url !== 'string') return { valid: false, error: 'url is required' };
  if (!ALLOWED_URL_PATTERN.test(url)) return { valid: false, error: 'Invalid URL format. Only http/https URLs are allowed.' };
  try {
    const parsed = new URL(url);
    if (BLOCKED_HOSTS.test(parsed.hostname)) return { valid: false, error: 'URL not allowed.' };
    return { valid: true, href: parsed.href };
  } catch {
    return { valid: false, error: 'Malformed URL.' };
  }
}

// AI Routes
app.post('/api/ai/generate-bullets', async (req: AuthRequest, res: Response) => {
  try {
    const { role, company, industry } = generateBulletsSchema.parse(req.body);
    const bullets = await aiService.generateBulletPoints(role, company, industry);
    res.json({ bullets });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate bullets. Please try again.');
  }
});

app.post('/api/ai/generate-summary', async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, experience, skills } = generateSummarySchema.parse(req.body);
    const summary = await aiService.generateSummary(name || '', title, experience, skills || []);
    res.json({ summary });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate summary. Please try again.');
  }
});

app.post('/api/ai/tailor-resume', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription } = tailorResumeSchema.parse(req.body);
    const result = await aiService.tailorResume(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to tailor resume. Please try again.');
  }
});

app.post('/api/ai/generate-cover-letter', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription } = tailorResumeSchema.parse(req.body);
    const result = await aiService.generateCoverLetter(resume, jobDescription);
    res.json({ text: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate cover letter. Please try again.');
  }
});

app.post('/api/ai/generate-interview-prep', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription } = tailorResumeSchema.parse(req.body);
    const result = await aiService.generateInterviewPrep(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate interview prep. Please try again.');
  }
});

app.post('/api/ai/ats-score', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription } = atsScoreSchema.parse(req.body);
    const result = await aiService.analyzeAtsScore(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to analyze ATS score. Please try again.');
  }
});

app.post('/api/ai/generate-full-resume', async (req: AuthRequest, res: Response) => {
  try {
    const params = generateFullResumeSchema.parse(req.body);
    const result = await aiService.generateFullResume(params);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate resume. Please try again.');
  }
});

app.post('/api/ai/generate-smart-resume', async (req: AuthRequest, res: Response) => {
  try {
    const params = generateFullResumeSchema.parse(req.body);
    const result = await aiService.generateSmartTailoredResume(params);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to generate smart resume. Please try again.');
  }
});

app.post('/api/ai/ats-tailor', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, jobDescription, atsResult } = atsTailorSchema.parse(req.body);
    const result = await aiService.atsTailor(resume, jobDescription, atsResult);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to tailor resume. Please try again.');
  }
});

app.post('/api/ai/find-skills', async (req: AuthRequest, res: Response) => {
  try {
    const { jobTitle } = findSkillsSchema.parse(req.body);
    const skills = await aiService.findSkills(jobTitle);
    res.json(skills);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to find skills. Please try again.');
  }
});

app.post('/api/ai/smart-fit', async (req: AuthRequest, res: Response) => {
  try {
    const { resume, config, targetPages, userPrompt } = smartFitSchema.parse(req.body);
    const result = await aiService.smartFit(resume, config, targetPages, userPrompt);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to run smart fit. Please try again.');
  }
});

app.post('/api/ai/rephrase', async (req: AuthRequest, res: Response) => {
  try {
    const { text, instruction } = rephraseSchema.parse(req.body);
    const rephrased = await aiService.rephrase(text, instruction);
    res.json({ text: rephrased });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    return serverError(res, error, 'Failed to rephrase text. Please try again.');
  }
});

// Fix 8: SSRF-protected URL fetch — validates scheme and blocks internal/private IP ranges
app.post('/api/fetch-job-url', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const check = validateExternalUrl(req.body?.url);
    if (!check.valid) {
      return res.status(400).json({ error: check.error });
    }

    const text = await aiService.scrapeUrl(check.href);

    if (text.length < 100) {
      return res.status(422).json({ error: 'No job content could be extracted from this URL. Please copy-paste the job description text instead.' });
    }

    res.json({ text: text.slice(0, 8000) });
  } catch (error: any) {
    return serverError(res, error, 'Failed to fetch URL. Please copy-paste the job description instead.');
  }
});

// Fix 6: Global error handler — catches any unhandled errors thrown in middleware or routes.
// Must have 4 parameters to be recognized as an error handler by Express.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: Response, _next: express.NextFunction) => {
  console.error('[Unhandled Error]', err);
  const status = err.status || err.statusCode || 500;
  const message = isDev ? err.message : 'An unexpected error occurred. Please try again.';
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
