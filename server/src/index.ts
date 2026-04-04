import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import * as aiService from './services/claude.service.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

// PDF Generation
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { html, filename } = req.body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename || 'resume.pdf'}`);
    res.send(pdf);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
