import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import puppeteer, { type Browser } from 'puppeteer';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType,
} from 'docx';

const router = Router();

// Reuse a single browser instance across requests to avoid per-request launch overhead.
// Reconnect automatically if it crashes.
let browserInstance: Browser | null = null;
let requestCount = 0;
const MAX_REQUESTS_PER_BROWSER = 50; // Restart browser after 50 renders to prevent memory leaks

async function getBrowser(): Promise<Browser> {
  if (browserInstance) {
    try {
      if (requestCount >= MAX_REQUESTS_PER_BROWSER) {
        console.log('[export] Browser request limit reached. Restarting...');
        await browserInstance.close().catch(() => {});
        browserInstance = null;
        requestCount = 0;
      } else {
        await browserInstance.version(); // throws if disconnected
        return browserInstance;
      }
    } catch {
      browserInstance = null;
      requestCount = 0;
    }
  }

  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',               // required on Linux/Render (non-root)
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',    // avoids /dev/shm exhaustion in containers
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });

  // Ensure browser is closed on process exit
  browserInstance.on('disconnected', () => {
    if (browserInstance) {
      console.log('[export] Browser disconnected');
      browserInstance = null;
    }
  });

  return browserInstance;
}

// Global cleanup
process.on('SIGINT', async () => {
  if (browserInstance) {
    await browserInstance.close();
    process.exit(0);
  }
});
process.on('SIGTERM', async () => {
  if (browserInstance) {
    await browserInstance.close();
    process.exit(0);
  }
});

router.post('/pdf', async (req: AuthRequest, res: Response) => {
  const { html, filename = 'resume', metadata = {} } = req.body;

  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'html is required' });
  }

  const safeFilename = filename.replace(/[^\w\s\-\.]/g, '').trim() || 'resume';

  let page;
  try {
    const browser = await getBrowser();
    requestCount++;
    page = await browser.newPage();
    
    // Set a per-page timeout
    page.setDefaultTimeout(30000); // 30s max for any operation

    // 794px = 210mm at 96 dpi — matches the A4 width used in the preview
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    // Inject CSS to ensure links are clickable and have proper cursor
    const cssToInject = `
      <style>
        a { text-decoration: none !important; color: inherit !important; -webkit-print-color-adjust: exact; }
        @media print {
          a[href]:after { content: none !important; }
          .no-print { display: none !important; }
        }
      </style>
    `;
    // Strip script tags to prevent arbitrary JS execution in the Puppeteer context.
    const sanitizedHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const finalHtml = sanitizedHtml.replace('</head>', `${cssToInject}</head>`);

    // waitUntil: networkidle0 ensures Google Fonts are fully loaded before rendering.
    try {
      await page.setContent(finalHtml, { waitUntil: 'networkidle0', timeout: 15000 });
    } catch {
      console.warn('[export] setContent timeout — generating PDF with available fonts');
    }

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      // Margins are already baked into the HTML body padding; set PDF margins to 0.
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      // Metadata injection (Note: Puppeteer supports basic metadata via browser-level or third-party libs usually, 
      // but we can set the title tag in HTML which Puppeteer uses as the PDF Title)
      displayHeaderFooter: false,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);
    res.send(Buffer.from(pdf));
  } catch (error: any) {
    console.error('[export] PDF generation error:', error);
    browserInstance = null; // force a fresh browser on the next request
    requestCount = 0;
    res.status(500).json({ error: error.message || 'PDF generation failed' });
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
});

// Helper: strip HTML tags from bullet strings
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '6366F1', space: 4 },
    },
  });
}

function bodyText(text: string, options: { bold?: boolean; italic?: boolean } = {}): TextRun {
  return new TextRun({ text, bold: options.bold, italics: options.italic, size: 20 });
}

router.post('/docx', async (req: AuthRequest, res: Response) => {
  const { resume, filename = 'resume' } = req.body;

  if (!resume || typeof resume !== 'object') {
    return res.status(400).json({ error: 'resume object is required' });
  }

  const safeFilename = (filename as string).replace(/[^\w\s\-\.]/g, '').trim() || 'resume';

  try {
    const p = resume.personal || {};
    const children: Paragraph[] = [];

    // ── NAME & CONTACT ─────────────────────────────────────────
    children.push(new Paragraph({
      children: [new TextRun({ text: p.name || '', bold: true, size: 48, color: '1F2937' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }));

    if (p.title) {
      children.push(new Paragraph({
        children: [new TextRun({ text: p.title, size: 26, color: '6366F1', italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }));
    }

    const contactParts: string[] = [];
    if (p.email) contactParts.push(p.email);
    if (p.phone) contactParts.push(p.phone);
    if (p.location) contactParts.push(p.location);
    if (p.linkedin) contactParts.push(p.linkedin);
    if (p.website) contactParts.push(p.website);

    if (contactParts.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '6B7280' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }));
    }

    // ── SUMMARY ────────────────────────────────────────────────
    const summary = stripHtml(p.summary || '');
    if (summary) {
      children.push(sectionHeading('Professional Summary'));
      children.push(new Paragraph({
        children: [bodyText(summary)],
        spacing: { after: 100 },
      }));
    }

    // ── EXPERIENCE ─────────────────────────────────────────────
    const experience: any[] = resume.experience || [];
    if (experience.length > 0) {
      children.push(sectionHeading('Experience'));
      for (const exp of experience) {
        const dateRange = [exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' – ');
        children.push(new Paragraph({
          children: [
            bodyText(`${exp.company || ''}`, { bold: true }),
            bodyText(exp.role ? `  ·  ${exp.role}` : '', { italic: true }),
          ],
          spacing: { before: 120, after: 40 },
        }));
        if (dateRange) {
          children.push(new Paragraph({
            children: [new TextRun({ text: dateRange, size: 18, color: '6B7280', italics: true })],
            spacing: { after: 60 },
          }));
        }
        for (const bullet of (exp.bullets || [])) {
          const text = stripHtml(bullet);
          if (text) {
            children.push(new Paragraph({
              children: [bodyText(`• ${text}`)],
              spacing: { after: 40 },
              indent: { left: 360 },
            }));
          }
        }
      }
    }

    // ── EDUCATION ──────────────────────────────────────────────
    const education: any[] = resume.education || [];
    if (education.length > 0) {
      children.push(sectionHeading('Education'));
      for (const edu of education) {
        children.push(new Paragraph({
          children: [bodyText(edu.school || '', { bold: true })],
          spacing: { before: 100, after: 40 },
        }));
        const degreeField = [edu.degree, edu.field].filter(Boolean).join(' in ');
        if (degreeField) {
          children.push(new Paragraph({
            children: [bodyText(degreeField, { italic: true })],
            spacing: { after: 40 },
          }));
        }
        const eduDate = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
        if (eduDate) {
          children.push(new Paragraph({
            children: [new TextRun({ text: eduDate, size: 18, color: '6B7280' })],
            spacing: { after: 40 },
          }));
        }
        if (edu.gpa) {
          children.push(new Paragraph({
            children: [bodyText(`GPA: ${edu.gpa}`)],
            spacing: { after: 40 },
          }));
        }
      }
    }

    // ── SKILLS ─────────────────────────────────────────────────
    const skills: any[] = resume.skills || [];
    if (skills.length > 0) {
      children.push(sectionHeading('Skills'));
      children.push(new Paragraph({
        children: [bodyText(skills.map((s: any) => s.name).join('  ·  '))],
        spacing: { after: 100 },
      }));
    }

    // ── PROJECTS ───────────────────────────────────────────────
    const projects: any[] = resume.projects || [];
    if (projects.length > 0) {
      children.push(sectionHeading('Projects'));
      for (const proj of projects) {
        children.push(new Paragraph({
          children: [bodyText(proj.title || '', { bold: true })],
          spacing: { before: 100, after: 40 },
        }));
        if (proj.tech && proj.tech.length > 0) {
          children.push(new Paragraph({
            children: [new TextRun({ text: proj.tech.join(', '), size: 18, color: '6B7280', italics: true })],
            spacing: { after: 40 },
          }));
        }
        const desc = stripHtml(proj.description || '');
        if (desc) {
          children.push(new Paragraph({
            children: [bodyText(desc)],
            spacing: { after: 40 },
          }));
        }
        if (proj.url) {
          children.push(new Paragraph({
            children: [new TextRun({ text: proj.url, size: 18, color: '6366F1' })],
            spacing: { after: 40 },
          }));
        }
      }
    }

    // ── CERTIFICATIONS ─────────────────────────────────────────
    const certifications: any[] = resume.certifications || [];
    if (certifications.length > 0) {
      children.push(sectionHeading('Certifications'));
      for (const cert of certifications) {
        const parts = [cert.name, cert.issuer, cert.date].filter(Boolean);
        children.push(new Paragraph({
          children: [bodyText(parts.join('  ·  '))],
          spacing: { before: 80, after: 40 },
        }));
      }
    }

    // ── LANGUAGES ──────────────────────────────────────────────
    const languages: any[] = resume.languages || [];
    if (languages.length > 0) {
      children.push(sectionHeading('Languages'));
      children.push(new Paragraph({
        children: [bodyText(languages.map((l: any) => l.proficiency ? `${l.language} (${l.proficiency})` : l.language).join('  ·  '))],
        spacing: { after: 100 },
      }));
    }

    // ── CUSTOM SECTIONS ────────────────────────────────────────
    const custom: any[] = resume.custom || [];
    for (const section of custom) {
      if (section.sectionTitle && section.entries?.length > 0) {
        children.push(sectionHeading(section.sectionTitle));
        for (const entry of section.entries) {
          children.push(new Paragraph({
            children: [bodyText(`• ${entry}`)],
            spacing: { after: 40 },
            indent: { left: 360 },
          }));
        }
      }
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.docx"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('[export] DOCX generation error:', error);
    res.status(500).json({ error: error.message || 'DOCX generation failed' });
  }
});

export default router;
