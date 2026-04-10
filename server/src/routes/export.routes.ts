import { Router } from 'express';
import puppeteer, { type Browser } from 'puppeteer';

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

  return browserInstance;
}

router.post('/pdf', async (req: any, res: any) => {
  const { html, filename = 'resume' } = req.body;

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

    // waitUntil: networkidle0 ensures Google Fonts are fully loaded before rendering.
    // Wrapped in try/catch so a slow font CDN won't block the whole export.
    try {
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    } catch {
      // Timeout — fonts may not be loaded but the content is; proceed anyway.
      console.warn('[export] setContent timeout — generating PDF with available fonts');
    }

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      // Margins are already baked into the HTML body padding; set PDF margins to 0.
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
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

export default router;
