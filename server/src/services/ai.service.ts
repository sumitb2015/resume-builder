import OpenAI from 'openai';
import dotenv from 'dotenv';
import FirecrawlApp from '@mendable/firecrawl-js';
import { logger } from '../lib/logger';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firecrawl = process.env.FIRECRAWL_API_KEY 
  ? new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
  : null;

const MODEL = 'gpt-4o-mini';

export const checkHealth = async (): Promise<boolean> => {
  try {
    // Simple light-weight call to check API connectivity
    await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    });
    return true;
  } catch (err) {
    logger.error('OpenAI Health Check Failed', err);
    return false;
  }
};

/**
 * Fix 9: Prompt injection sanitizer.
 * Strips characters and patterns commonly used to hijack AI instructions.
 * Applied to all user-controlled string inputs before embedding in prompts.
 */
function sanitizeForPrompt(input: string, maxLength = 4000): string {
  return input
    .replace(/[<>]/g, '')                      // strip HTML angle brackets
    .replace(/\[INST\]|\[\/INST\]/gi, '')      // strip LLaMA instruction markers
    .replace(/###\s*(System|Instruction|Prompt)/gi, '') // strip common jailbreak headers
    .replace(/#{4,}/g, '###')                  // collapse excessive markdown headings
    .slice(0, maxLength);
}

async function ask(prompt: string, jsonMode = false): Promise<string> {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
    response_format: jsonMode ? { type: "json_object" } : undefined,
  });
  return res.choices[0]?.message?.content?.trim() ?? '';
}

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in response');
    return JSON.parse(match[0]);
  }
}

export const scrapeUrl = async (url: string): Promise<string> => {
  if (!firecrawl) {
    throw new Error('Firecrawl API key is not configured. Please set FIRECRAWL_API_KEY.');
  }
  const response = (await firecrawl.scrape(url, {
    formats: ['markdown'],
  })) as any;
  if (!response.success) {
    throw new Error(response.error || 'Failed to scrape URL');
  }
  return response.markdown || '';
};

export const generateSmartTailoredResume = async (params: {
  targetRole: string;
  industry: string;
  currentRole?: string;
  experience: string;
  context?: string;
  education?: string;
  achievements?: string;
}) => {
  let marketTech = "Not available";
  if (firecrawl) {
    try {
      const scrapeResponse = (await firecrawl.scrape(`https://www.google.com/search?q=latest+technologies+and+skills+for+${encodeURIComponent(params.targetRole)}+in+${encodeURIComponent(params.industry)}+2024+2025`, {
        formats: ['markdown'],
      })) as any;
      if (scrapeResponse.success && scrapeResponse.markdown) {
        marketTech = scrapeResponse.markdown.slice(0, 3000);
      }
    } catch (error) {
      console.error("Firecrawl search failed:", error);
    }
  }

  const prompt = `You are an expert AI resume strategist. Your task is to generate a complete, highly professional, and modern resume in JSON format.

  User Details:
  - Target Role: ${sanitizeForPrompt(params.targetRole, 200)}
  - Industry: ${sanitizeForPrompt(params.industry, 200)}
  - Current Role: ${sanitizeForPrompt(params.currentRole || 'N/A', 200)}
  - Years of Experience: ${sanitizeForPrompt(params.experience, 100)}
  - Education: ${sanitizeForPrompt(params.education || 'N/A', 500)}
  - Key Achievements: ${sanitizeForPrompt(params.achievements || 'N/A', 2000)}
  - Additional Context: ${sanitizeForPrompt(params.context || 'N/A', 2000)}

  Latest Market Data (via Web Search):
  ${marketTech}

  Goal:
  1. Generate a FULL, DETAILED sample resume of at least 2 pages in the specified JSON structure. Extrapolate realistic, quantified achievements, multiple relevant past roles, and a robust education section so the user has a rich template to edit later.
  2. Logically incorporate relevant, in-demand technologies and tools from the market data into the resume's skills and experience sections. 
  3. Ensure the added tech aligns with the user's seniority and experience level.
  4. Provide an analysis block explaining what was added and why.

  Return ONLY a valid JSON object with this exact structure:
  {
    "resume": {
      "personal": { "name": "...", "title": "...", "summary": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "...", "website": "..." },
      "experience": [ { "id": "1", "company": "...", "role": "...", "startDate": "...", "endDate": "...", "isCurrent": true/false, "bullets": ["...", "..."] } ],
      "education": [ { "id": "1", "school": "...", "degree": "...", "field": "...", "startDate": "...", "endDate": "..." } ],
      "skills": [ { "id": "1", "name": "...", "level": 90 } ],
      "projects": [],
      "certifications": [],
      "languages": [],
      "custom": []
    },
    "analysis": {
      "addedTechnologies": ["Tech A", "Tool B"],
      "changesMade": ["Updated summary to reflect X", "Added Y to experience at Z because it's highly trending in the industry"]
    }
  }`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: "You are a professional resume writer." }, { role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate resume content");
  
  return JSON.parse(content);
};

export const generateBulletPoints = async (role: string, company: string, industry: string): Promise<string[]> => {
  const safeRole = sanitizeForPrompt(role, 200);
  const safeCompany = sanitizeForPrompt(company, 200);
  const safeIndustry = sanitizeForPrompt(industry, 200);
  const prompt = `You are a professional resume writer specializing in high-impact, quantified bullet points.
Write 3 strong, results-oriented bullet points for a ${safeRole} at ${safeCompany} in the ${safeIndustry} industry.

Guidelines:
1. Start with strong action verbs (e.g., "Spearheaded", "Architected", "Optimized").
2. Include specific metrics and KPIs (e.g., "reduced latency by 30%", "increased revenue by $2M").
3. Use the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
4. Keep bullets concise but descriptive.

Example for a Software Engineer:
- "Reduced infrastructure costs by 25% ($120k/year) by migrating legacy monolithic services to a containerized microservices architecture on AWS."

Return ONLY valid JSON in this format:
{
  "bullets": ["bullet 1", "bullet 2", "bullet 3"]
}`;

  const text = await ask(prompt, true);
  const parsed = extractJSON(text);
  return Array.isArray(parsed.bullets) ? parsed.bullets : [];
};

export const generateSummary = async (name: string, title: string, experience: string, skills: string[]): Promise<string> => {
  const safeName = sanitizeForPrompt(name, 200);
  const safeTitle = sanitizeForPrompt(title, 200);
  const safeExperience = sanitizeForPrompt(experience, 500);
  const safeSkills = skills.map(s => sanitizeForPrompt(s, 100)).filter(Boolean).slice(0, 30);
  const prompt = `Write a 2-3 sentence professional resume summary for ${safeName || 'this professional'}, a ${safeTitle} with ${safeExperience} years of experience.
Key skills to weave in naturally: ${safeSkills.join(', ') || 'leadership, problem-solving, communication'}.
Make it compelling, first-person, and achievement-oriented. Return ONLY the summary text.`;

  return (await ask(prompt)).trim();
};

export const tailorResume = async (resumeData: any, jobDescription: string) => {
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const safeJobDesc = sanitizeForPrompt(jobDescription, 3000);
  const prompt = `You are an expert resume consultant. Compare this resume to the job description and provide specific improvements.

Resume: ${resumeStr}

Job Description: ${safeJobDesc}

Analyze carefully and return ONLY valid JSON with this exact structure:
{
  "missingKeywords": ["up to 8 keywords missing from the resume that appear in the JD"],
  "rewrittenBullets": [
    {"original": "exact bullet from resume", "suggested": "rewritten version matching JD language"},
    {"original": "another bullet", "suggested": "improved version"}
  ],
  "suggestedSummary": "rewritten professional summary tailored to this specific role"
}`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};

export const atsTailor = async (resumeData: any, jobDescription: string, atsResult: any) => {
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const safeJobDesc = sanitizeForPrompt(jobDescription, 3000);
  const score = Number(atsResult?.score) || 0;
  const missingKeywords = Array.isArray(atsResult?.missingKeywords)
    ? atsResult.missingKeywords.map((k: string) => sanitizeForPrompt(String(k), 100)).slice(0, 15).join(', ')
    : 'none identified';
  const weakSections = Array.isArray(atsResult?.weakSections)
    ? atsResult.weakSections.map((s: string) => sanitizeForPrompt(String(s), 100)).slice(0, 10).join(', ')
    : 'none identified';
  const feedback = sanitizeForPrompt(String(atsResult?.feedback || ''), 500);
  const prompt = `You are an expert resume consultant. An ATS scan of this resume against the job description returned a score of ${score}/100.

ATS Findings:
- Missing keywords: ${missingKeywords}
- Weak sections: ${weakSections}
- Feedback: ${feedback}

Resume: ${resumeStr}

Job Description: ${safeJobDesc}

Using the ATS findings as your guide, produce specific, actionable resume fixes. Focus on the weak sections and missing keywords identified above.
Return ONLY valid JSON with this exact structure:
{
  "missingKeywords": ["keywords from the ATS findings or JD still missing from the resume, up to 10"],
  "rewrittenBullets": [
    {"original": "exact bullet from resume that is weak", "suggested": "rewritten version that incorporates missing keywords and better matches the JD"},
    {"original": "another weak bullet", "suggested": "improved version"}
  ],
  "suggestedSummary": "rewritten professional summary that directly addresses the ATS gaps and targets this specific role"
}`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};

export const analyzeAtsScore = async (resumeData: any, jobDescription: string) => {
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const safeJobDesc = sanitizeForPrompt(jobDescription, 3000);
  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.

Resume: ${resumeStr}

Job Description: ${safeJobDesc}

Score the resume from 0-100 based on: keyword match (40%), required skills coverage (30%), formatting/completeness (30%).
Return ONLY valid JSON:
{
  "score": 78,
  "missingKeywords": ["keyword1", "keyword2", "up to 10 missing"],
  "weakSections": ["section name that needs work"],
  "feedback": "2-3 sentence actionable summary of what to improve"
}`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};

export const findSkills = async (jobTitle: string) => {
  const safeJobTitle = sanitizeForPrompt(jobTitle, 200);
  const prompt = `List the 20 most important skills for a ${safeJobTitle} role in today's job market.
Split into technical and soft skills. Return ONLY valid JSON:
{
  "technical": ["10 technical skills"],
  "soft": ["10 soft skills"]
}`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};

export const smartFit = async (resumeData: any, config: any, targetPages: number, userPrompt?: string) => {
  const safeUserPrompt = userPrompt ? sanitizeForPrompt(userPrompt, 1000) : '';
  const isMinorRephrase = !safeUserPrompt.trim();
  const goal = isMinorRephrase
    ? `perform minor rephrasing to fit exactly ${targetPages} page(s) while keeping the context identical`
    : `strictly follow this instruction: "${safeUserPrompt}" to fit exactly ${targetPages} page(s)`;
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const configStr = JSON.stringify(config?.settings ?? {}, null, 2).slice(0, 1000);

  const prompt = `You are a professional resume designer and expert copywriter. Your goal is to ${goal}.

  Current Resume Data: ${resumeStr}
  Current Styling: ${configStr}
  Target Page Count: ${targetPages}

  Instructions:
  1. Shorten or expand the professional summary to meet the target page count.
  2. Reword experience bullet points and project descriptions to be more concise (to save space) or more descriptive (to fill space) as needed.
  3. ${isMinorRephrase ? "Maintain the original context and meaning perfectly. Only change the phrasing and length." : "Execute the user's specific refinement request while optimizing for space."}
  4. Suggest optimal values for styling parameters:
     - fontSize (80 to 120, where 100 is default)
     - margin (5 to 30 mm)
     - lineHeight (1.2 to 2.0)

  Few-Shot Example (Shortening):
  Original: "Successfully spearheaded a cross-functional team of 15 engineers to design, develop, and deploy a mission-critical cloud-based inventory management system that resulted in a 30% reduction in operational overhead and significantly improved supply chain transparency."
  Rewritten: "Led 15-engineer team to deploy a cloud inventory system, reducing overhead by 30% and improving supply chain visibility."

  Few-Shot Example (Expanding):
  Original: "Managed customer database and resolved technical issues."
  Rewritten: "Overseaw a comprehensive SQL-based customer database of 50k+ entries, proactively identifying and resolving complex technical issues to maintain 99.9% system uptime."

  Return ONLY valid JSON with this exact structure:
  {
    "refactoredResume": {
       "personal": { "summary": "..." },
       "experience": [ { "id": "uuid", "bullets": ["...", "..."] } ],
       "projects": [ { "id": "uuid", "description": "..." } ]
    },
    "suggestedSettings": {
       "fontSize": 95,
       "margin": 12,
       "lineHeight": 1.4
    },
    "modifiedFields": [
       "personal.summary", 
       "experience.[id].bullets.[index]",
       "projects.[id].description"
    ]
  }`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};
export const generateFullResume = async (params: { currentRole?: string; targetRole: string; industry: string; experience: string; context?: string }) => {
  const prompt = `You are an expert AI resume writer. Your task is to generate a complete, highly professional, and realistic resume in JSON format.
The user provided the following details:
- Target Role: ${sanitizeForPrompt(params.targetRole, 200)}
- Current/Previous Role: ${sanitizeForPrompt(params.currentRole || 'Not specified', 200)}
- Industry: ${sanitizeForPrompt(params.industry, 200)}
- Years of Experience: ${sanitizeForPrompt(params.experience, 100)}
- Additional Context / Skills / Achievements: ${sanitizeForPrompt(params.context || 'Not specified', 2000)}

Based on this, generate a FULL resume. Extrapolate realistic, quantified achievements, plausible companies, dates, and educational background to make the resume look complete and impressive. Use strong action verbs and industry-standard keywords. 

You must return ONLY a valid JSON object that strictly matches this TypeScript interface:
{
  "personal": {
    "name": "First Last", "title": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "...", "website": "...", "summary": "..."
  },
  "experience": [
    { "id": "1", "company": "...", "role": "...", "startDate": "...", "endDate": "...", "isCurrent": true/false, "bullets": ["...", "..."] }
  ],
  "education": [
    { "id": "1", "school": "...", "degree": "...", "field": "...", "startDate": "...", "endDate": "...", "gpa": "..." }
  ],
  "skills": [
    { "id": "1", "name": "...", "level": 90 }
  ],
  "projects": [],
  "certifications": [],
  "languages": [
    { "id": "1", "language": "English", "proficiency": "Native" }
  ],
  "custom": []
}

Ensure the output is well-formatted, corporate, and ATS-friendly. Return ONLY the JSON object.`;

const text = await ask(prompt);
return extractJSON(text);
};

export const rephrase = async (text: string, instruction?: string): Promise<string> => {
const safeText = sanitizeForPrompt(text, 5000);
const safeInstruction = instruction ? sanitizeForPrompt(instruction, 500) : undefined;
let fullPrompt = `Rephrase the following resume content to be more professional, impactful, and concise:
"${safeText}"
Return ONLY the rephrased text.`;

if (safeInstruction) {
  fullPrompt = `Modify the following resume content based on this instruction: "${safeInstruction}"
Current content: "${safeText}"
Ensure the result is professional, achievement-oriented, and suitable for a high-end resume. Return ONLY the modified text.`;
}

return (await ask(fullPrompt)).trim();
};

export const generateCoverLetter = async (resumeData: any, jobDescription: string) => {
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const safeJobDesc = sanitizeForPrompt(jobDescription, 3000);
  const prompt = `You are an expert career coach and professional writer. Write a highly persuasive, modern cover letter for a candidate based on their resume and the job description.

Resume: ${resumeStr}

Job Description: ${safeJobDesc}

Instructions:
1. Use a professional but engaging tone.
2. Connect the candidate's specific achievements from the resume to the requirements in the JD.
3. Keep it under 400 words.
4. Use standard cover letter formatting (Date, Salutation, Intro, Body, Closing).
5. Ensure there are no placeholders like [Company Name]; use the information from the JD if available, otherwise use general terms.

Return the cover letter text only.`;

  return (await ask(prompt)).trim();
};

export const generateInterviewPrep = async (resumeData: any, jobDescription: string) => {
  const resumeStr = JSON.stringify(resumeData, null, 2).slice(0, 8000);
  const safeJobDesc = sanitizeForPrompt(jobDescription, 3000);
  const prompt = `You are an expert interviewer. Analyze this resume against the job description and prepare the candidate for an interview.

Resume: ${resumeStr}

Job Description: ${safeJobDesc}

Identify:
1. Potential gaps or weak points in the candidate's profile relative to the JD.
2. The top 5-8 most likely questions they will face (technical and behavioral).
3. For each question, provide a "Best way to answer" strategy and a sample response based on their resume.

Return ONLY valid JSON with this exact structure:
{
  "analysis": "2-3 sentence overview of the interview focus",
  "questions": [
    {
      "question": "The interview question",
      "type": "behavioral | technical | situational",
      "strategy": "How to approach this question",
      "sampleAnswer": "A strong response tailored to the resume"
    }
  ]
}`;

  const text = await ask(prompt, true);
  return extractJSON(text);
};
