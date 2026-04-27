import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerender from '@prerenderer/rollup-plugin'

// https://vite.dev/config/
export default defineConfig({
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
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 3000,
        headless: true
      },
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
})
