# External Tools & Integrations

The project integrates with several key external services to provide its full suite of features.

## Firebase
- **Authentication**: Used to manage user sign-in (Email, Google).
- **Firestore**: Stores user resume data, configurations, and subscription status.
- **Admin SDK**: Backend integration for secure data access and user management.

## OpenAI
- **Model**: `gpt-4o-mini` is used for most [[AI-Workflow|AI tasks]].
- **Functions**: Used for resume generation, summary writing, and job tailoring.
- **Health Check**: Regularly verified by the [[Backend-Services#Health-Checks|server's health check endpoint]].

## Razorpay
- **Payments**: Handles all subscription payments (Basic, Pro, Ultimate).
- **Webhooks**: Notifies the [[Backend-Services|Backend]] of successful payments to update user subscription status.

## Firecrawl
- **Web Scraping**: Used to extract data from job descriptions and search the web for industry trends.
- **LLM-Ready**: Outputs data in a format optimized for GPT processing.

## Puppeteer
- **PDF Engine**: Local library that provides a high-fidelity rendering environment for [[Export-Workflow|resume PDFs]].
