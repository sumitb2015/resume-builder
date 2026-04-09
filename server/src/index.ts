import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as aiService from './services/claude.service';
import parseRoutes from './routes/parse.routes';
import exportRoutes from './routes/export.routes';

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// AI Routes
app.post('/api/ai/generate-bullets', async (req, res) => {
  try {
    const { role, company, industry } = req.body;
    const bullets = await aiService.generateBulletPoints(role, company, industry);
    res.json({ bullets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-summary', async (req, res) => {
  try {
    const { name, title, experience, skills } = req.body;
    const summary = await aiService.generateSummary(name, title, experience, skills);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/tailor-resume', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    const result = await aiService.tailorResume(resume, jobDescription);
    res.json(result);
  } catch (error: any) {
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

app.post('/api/ai/ats-score', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    const result = await aiService.analyzeAtsScore(resume, jobDescription);
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

app.post('/api/ai/generate-full-resume', async (req, res) => {
  try {
    const { currentRole, targetRole, industry, experience, context } = req.body;
    const result = await aiService.generateFullResume({ currentRole, targetRole, industry, experience, context });
    res.json(result);
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return res.status(502).json({ error: `This site blocked access (${response.status}). Please copy-paste the job description text instead.` });
    }
    const html = await response.text();
    // Strip HTML tags and collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{2,}/g, '\n')
      .trim()
      .slice(0, 8000);

    if (text.length < 200) {
      return res.status(422).json({ error: 'This site uses JavaScript rendering — no job content could be extracted. Please copy-paste the job description text instead.' });
    }

    res.json({ text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch URL' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
