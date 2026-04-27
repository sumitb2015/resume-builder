import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerender from '@prerenderer/rollup-plugin'
import Renderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig(async () => {
  const isVercel = !!(process.env.VERCEL || process.env.CI);
  
  let chromium = null;
  if (isVercel) {
    // Dynamic import to avoid local issues on non-linux systems
    chromium = (await import('@sparticuz/chromium')).default;
  }

  const rendererConfig = {
    maxConcurrentRoutes: 1,
    renderAfterTime: 10000,
    renderAfterDocumentEvent: 'render-event',
    timeout: 60000,
    // @ts-ignore
    launchOptions: isVercel && chromium ? {
      headless: chromium.headless,
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    } : {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    }
  };

  return {
    plugins: [
      react(),
      prerender({
        routes: [
          '/',
          '/pricing',
          '/templates',
          '/features',
          '/faq',
          '/about',
          '/contact',
          '/blog'
        ],
        renderer: new Renderer(rendererConfig),
        postProcess(renderedRoute) {
          // Replace all script tags with async for better performance on prerendered pages
          renderedRoute.html = renderedRoute.html.replace(
            /<script\b[^>]*>([\s\S]*?)<\/script>/g,
            (match) => {
              if (match.includes('src=')) {
                return match.replace('<script', '<script async');
              }
              return match;
            }
          );
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
