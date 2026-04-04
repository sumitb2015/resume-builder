const FirecrawlApp = require('@mendable/firecrawl-js').default;
require('dotenv').config();
const fs = require('fs');

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function extractContent() {
  console.log('Extracting content from Enhancv...');
  try {
    const scrapeResult = await app.scrape('https://enhancv.com/', {
      formats: ['markdown', 'html'],
    });

    console.log('Scrape Result:', JSON.stringify(scrapeResult, null, 2));
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error || 'Unknown error'}`);
    }

    fs.writeFileSync('enhancv_content.json', JSON.stringify(scrapeResult, null, 2));
    console.log('Content extracted successfully to enhancv_content.json');
  } catch (error) {
    console.error('Error during extraction:', error);
  }
}

extractContent();
