import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as aiService from './services/claude.service';
import parseRoutes from './routes/parse.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173', 'http://localhost:4173'];

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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
