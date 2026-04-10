import OpenAI from 'openai';
import dotenv from 'dotenv';
import FirecrawlApp from '@mendable/firecrawl-js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});

const MODEL = 'gpt-4o-mini';

async function ask(prompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });
  return res.choices[0]?.message?.content?.trim() ?? '';
}

function extractJSON(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in response');
  return JSON.parse(match[0]);
}

export const scrapeUrl = async (url: string): Promise<string> => {
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

  const prompt = `You are an expert AI resume strategist. Your task is to generate a complete, highly professional, and modern resume in JSON format.
  
  User Details:
  - Target Role: ${params.targetRole}
  - Industry: ${params.industry}
  - Current Role: ${params.currentRole || 'N/A'}
  - Years of Experience: ${params.experience}
  - Education: ${params.education || 'N/A'}
  - Key Achievements: ${params.achievements || 'N/A'}
  - Additional Context: ${params.context || 'N/A'}

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
  const prompt = `Write 3 strong, quantified resume bullet points for a ${role} at ${company} in the ${industry} industry.
Focus on measurable impact, strong action verbs, and specific metrics.
Return ONLY valid JSON: {"bullets": ["bullet 1", "bullet 2", "bullet 3"]}`;

  const text = await ask(prompt);
  const parsed = extractJSON(text);
  return Array.isArray(parsed.bullets) ? parsed.bullets : [];
};

export const generateSummary = async (name: string, title: string, experience: string, skills: string[]): Promise<string> => {
  const prompt = `Write a 2-3 sentence professional resume summary for ${name || 'this professional'}, a ${title} with ${experience} years of experience.
Key skills to weave in naturally: ${skills.filter(Boolean).join(', ') || 'leadership, problem-solving, communication'}.
Make it compelling, first-person, and achievement-oriented. Return ONLY the summary text.`;

  return (await ask(prompt)).trim();
};

export const tailorResume = async (resumeData: any, jobDescription: string) => {
  const prompt = `You are an expert resume consultant. Compare this resume to the job description and provide specific improvements.

Resume: ${JSON.stringify(resumeData, null, 2)}

Job Description: ${jobDescription}

Analyze carefully and return ONLY valid JSON with this exact structure:
{
  "missingKeywords": ["up to 8 keywords missing from the resume that appear in the JD"],
  "rewrittenBullets": [
    {"original": "exact bullet from resume", "suggested": "rewritten version matching JD language"},
    {"original": "another bullet", "suggested": "improved version"}
  ],
  "suggestedSummary": "rewritten professional summary tailored to this specific role"
}`;

  const text = await ask(prompt);
  return extractJSON(text);
};

export const atsTailor = async (resumeData: any, jobDescription: string, atsResult: { score: number; missingKeywords: string[]; weakSections: string[]; feedback: string }) => {
  const prompt = `You are an expert resume consultant. An ATS scan of this resume against the job description returned a score of ${atsResult.score}/100.

ATS Findings:
- Missing keywords: ${atsResult.missingKeywords.join(', ') || 'none identified'}
- Weak sections: ${atsResult.weakSections.join(', ') || 'none identified'}
- Feedback: ${atsResult.feedback}

Resume: ${JSON.stringify(resumeData, null, 2)}

Job Description: ${jobDescription}

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

  const text = await ask(prompt);
  return extractJSON(text);
};

export const analyzeAtsScore = async (resumeData: any, jobDescription: string) => {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.

Resume: ${JSON.stringify(resumeData, null, 2)}

Job Description: ${jobDescription}

Score the resume from 0-100 based on: keyword match (40%), required skills coverage (30%), formatting/completeness (30%).
Return ONLY valid JSON:
{
  "score": 78,
  "missingKeywords": ["keyword1", "keyword2", "up to 10 missing"],
  "weakSections": ["section name that needs work"],
  "feedback": "2-3 sentence actionable summary of what to improve"
}`;

  const text = await ask(prompt);
  return extractJSON(text);
};

export const findSkills = async (jobTitle: string) => {
  const prompt = `List the 20 most important skills for a ${jobTitle} role in today's job market.
Split into technical and soft skills. Return ONLY valid JSON:
{
  "technical": ["10 technical skills"],
  "soft": ["10 soft skills"]
}`;

  const text = await ask(prompt);
  return extractJSON(text);
};

export const smartFit = async (resumeData: any, config: any, targetPages: number, userPrompt: string) => {
  const prompt = `You are a professional resume designer and copywriter. Your goal is to refactor the resume content and suggest styling parameters to fit the resume into exactly ${targetPages} page(s), while strictly following this user request: "${userPrompt}".

Current Resume Data: ${JSON.stringify(resumeData, null, 2)}
Current Styling: ${JSON.stringify(config.settings, null, 2)}

Instructions:
1. Shorten or expand the professional summary.
2. Reword experience bullet points to be more concise (to save space) or more descriptive (to fill space), depending on the goal.
3. Suggest optimal values for:
   - fontSize (80 to 120, where 100 is default)
   - margin (5 to 30 mm)
   - lineHeight (1.2 to 2.0)

Return ONLY valid JSON with this exact structure:
{
  "refactoredResume": {
     "personal": { "summary": "..." },
     "experience": [ { "id": "1", "bullets": ["...", "..."] } ],
     "projects": [ { "id": "1", "description": "..." } ]
  },
  "suggestedSettings": {
     "fontSize": 95,
     "margin": 12,
     "lineHeight": 1.4
  }
}`;

  const text = await ask(prompt);
  return extractJSON(text);
};

export const generateFullResume = async (params: { currentRole?: string; targetRole: string; industry: string; experience: string; context?: string }) => {
  const prompt = `You are an expert AI resume writer. Your task is to generate a complete, highly professional, and realistic resume in JSON format.
The user provided the following details:
- Target Role: ${params.targetRole}
- Current/Previous Role: ${params.currentRole || 'Not specified'}
- Industry: ${params.industry}
- Years of Experience: ${params.experience}
- Additional Context / Skills / Achievements: ${params.context || 'Not specified'}

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
let fullPrompt = `Rephrase the following resume content to be more professional, impactful, and concise:
"${text}"
Return ONLY the rephrased text.`;

if (instruction) {
  fullPrompt = `Modify the following resume content based on this instruction: "${instruction}"
Current content: "${text}"
Ensure the result is professional, achievement-oriented, and suitable for a high-end resume. Return ONLY the modified text.`;
}

return (await ask(fullPrompt)).trim();
};

export const generateCoverLetter = async (resumeData: any, jobDescription: string) => {
  const prompt = `You are an expert career coach and professional writer. Write a highly persuasive, modern cover letter for a candidate based on their resume and the job description.

Resume: ${JSON.stringify(resumeData, null, 2)}

Job Description: ${jobDescription}

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
  const prompt = `You are an expert interviewer. Analyze this resume against the job description and prepare the candidate for an interview.

Resume: ${JSON.stringify(resumeData, null, 2)}

Job Description: ${jobDescription}

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

  const text = await ask(prompt);
  return extractJSON(text);
};
