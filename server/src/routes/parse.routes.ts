import { Router } from 'express';
import multer from 'multer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = require('pdf-parse');
import mammoth from 'mammoth';
import * as parseService from '../services/parse.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = file.originalname.toLowerCase();
    const mime = file.mimetype;
    let rawText = '';

    if (ext.endsWith('.pdf') || mime === 'application/pdf') {
      const result = await pdfParse(file.buffer);
      rawText = result.text;
    } else if (ext.endsWith('.docx') || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or .docx file.' });
    }

    if (!rawText.trim()) {
      return res.status(422).json({ error: 'Could not extract text from the file. Make sure it is not a scanned image.' });
    }

    const parsed = await parseService.extractResumeFromText(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Upload parse error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

router.post('/linkedin', async (req: any, res: any) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Please paste your LinkedIn profile text (at least 50 characters).' });
    }

    const parsed = await parseService.extractResumeFromLinkedIn(text.trim());
    res.json(parsed);
  } catch (error: any) {
    console.error('LinkedIn parse error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse LinkedIn profile' });
  }
});

export default router;
