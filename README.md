# Resume Tailor (Enhancv Clone)

A modern, ATS-friendly resume builder with AI-powered job tailoring, inspired by [Enhancv](https://enhancv.com/).

## Features
- **Real-time Preview:** See your resume update as you type.
- **Modern UI:** Professional, minimalist design with a focus on "human" elements (Life Philosophy, etc.).
- **Job Tailoring:** Paste a job description and let AI (mocked) align your resume to the role.
- **ATS Friendly:** Clean structure and parseable text layers.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Vanilla CSS.
- **Backend:** Node.js, Express, TypeScript.
- **Extraction:** Firecrawl.

## How to Run

### 1. Prerequisites
- Node.js installed.
- Firecrawl API Key in `.env`.

### 2. Start the Backend
```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```

## AI Integration
To enable real Google Gemini AI features, add `GOOGLE_GENAI_API_KEY` to your `.env` and update `server/src/index.ts` to use `@google/generative-ai`.
