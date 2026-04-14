# Backend Services & API Architecture

The backend is an Express.js server that acts as a secure gateway to [[External-Tools#OpenAI|AI]], [[External-Tools#Firebase|Firestore]], and [[Export-Workflow|Puppeteer]].

## Key API Routes
- `/api/ai/*`: Interfaces with [[AI-Workflow|aiService]] for summary generation, bullet point optimization, and full resume generation.
- `/api/export/*`: Handles PDF generation via [[Export-Workflow|Puppeteer]].
- `/api/user/*`: Manages user profiles, saved resumes, and subscription data.
- `/api/payment/*`: Webhooks for [[External-Tools#Razorpay|Razorpay]] payments.

## Backend Core Features
- **Structured Logging**: Using the [[Backend-Services#Logger|logger.ts]] utility to log JSON in production and pretty-printed text in development.
- **Health Checks**: A `/health` endpoint that pings [[External-Tools#Firebase|Firebase]] and [[External-Tools#OpenAI|OpenAI]] to verify system status.
- **Rate Limiting**: AI endpoints are rate-limited per user to prevent abuse.
- **SSRF Protection**: Validates job URLs before [[External-Tools#Firecrawl|Scraping]].

## Security
- **Firebase Auth Middleware**: All protected routes require a valid Firebase ID token.
- **Data Validation**: Using **Zod schemas** to validate all incoming JSON bodies.
