# AI Workflow & LLM Processing

The AI engine uses **OpenAI GPT-4o-mini** to provide professional career coaching and resume writing.

## Career Wizard Flow
1. **User Input**: Role, Industry, Experience Level.
2. **Web Search**: [[External-Tools#Firecrawl|Firecrawl]] scrapes the web for the latest skills and trends in the specified role and industry.
3. **AI Generation**: OpenAI takes the user input and market data to generate a complete, 2-page resume in JSON format.
4. **Analysis**: The AI provides a summary of added technologies and changes made to improve ATS scoring.

## AI Optimization Services
- **Summary Generator**: Crafts a compelling 2-3 sentence summary.
- **Bullet Optimizer**: Rewrites experience bullet points using the **Google XYZ formula**.
- **ATS Checker**: Scores the resume against a job description and suggests missing keywords.
- **Smart Fit**: Adjusts content and styling (font size, margins) to fit the target page count.

## Security & Sanitization
- **Prompt Sanitizer**: Strips HTML tags and common prompt injection patterns before sending data to OpenAI.
- **JSON Mode**: AI responses are strictly validated against JSON schemas.
