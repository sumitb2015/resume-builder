import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as aiService from './services/ai.service';
import parseRoutes from './routes/parse.routes';
import exportRoutes from './routes/export.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://bespokecv.in',
  'https://www.bespokecv.in',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use('/api/parse', parseRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

import { z } from 'zod';

// Validation Schemas
const ResumeSchema = z.object({
  personal: z.any().optional(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  skills: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
}).passthrough();

const generateBulletsSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  industry: z.string().min(1),
});

const generateSummarySchema = z.object({
  name: z.string().optional(),
  title: z.string().min(1),
  experience: z.string().min(1),
  skills: z.array(z.string()).optional(),
});

const tailorResumeSchema = z.object({
  resume: ResumeSchema,
  jobDescription: z.string().min(10, "Job description is too short"),
});

const atsScoreSchema = z.object({
  resume: ResumeSchema,
  jobDescription: z.string().min(10),
});

const generateFullResumeSchema = z.object({
  targetRole: z.string().min(1),
  industry: z.string().min(1),
  experience: z.string().min(1),
  currentRole: z.string().optional(),
  context: z.string().optional(),
});

// AI Routes
app.post('/api/ai/generate-bullets', async (req, res) => {
  try {
    const { role, company, industry } = generateBulletsSchema.parse(req.body);
    const bullets = await aiService.generateBulletPoints(role, company, industry);
    res.json({ bullets });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-summary', async (req, res) => {
  try {
    const { name, title, experience, skills } = generateSummarySchema.parse(req.body);
    const summary = await aiService.generateSummary(name || '', title, experience, skills || []);
    res.json({ summary });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/tailor-resume', async (req, res) => {
  try {
    const { resume, jobDescription } = tailorResumeSchema.parse(req.body);
    const result = await aiService.tailorResume(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/ats-score', async (req, res) => {
  try {
    const { resume, jobDescription } = atsScoreSchema.parse(req.body);
    const result = await aiService.analyzeAtsScore(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-full-resume', async (req, res) => {
  try {
    const params = generateFullResumeSchema.parse(req.body);
    const result = await aiService.generateFullResume(params);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-smart-resume', async (req, res) => {
  try {
    const params = generateFullResumeSchema.parse(req.body); // Shares same schema
    const result = await aiService.generateSmartTailoredResume(params);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/ats-tailor', async (req, res) => {
  try {
    const { resume, jobDescription, atsResult } = req.body;
    const result = await aiService.atsTailor(resume, jobDescription, atsResult);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/find-skills', async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const skills = await aiService.findSkills(jobTitle);
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/smart-fit', async (req, res) => {
  try {
    const { resume, config, targetPages, userPrompt } = req.body;
    const result = await aiService.smartFit(resume, config, targetPages, userPrompt);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/rephrase', async (req, res) => {
  try {
    const { text, instruction } = req.body;
    const rephrased = await aiService.rephrase(text, instruction);
    res.json({ text: rephrased });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fetch-job-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url is required' });
    }

    const text = await aiService.scrapeUrl(url);

    if (text.length < 100) {
      return res.status(422).json({ error: 'No job content could be extracted from this URL. Please copy-paste the job description text instead.' });
    }

    res.json({ text: text.slice(0, 8000) });
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch URL: ${error.message}. Please copy-paste the job description instead.` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
