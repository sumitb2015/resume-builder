import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});

export const generateSmartTailoredResume = async (params: {
  targetRole: string;
  industry: string;
  currentRole?: string;
  experience: string;
  context?: string;
  education?: string;
  achievements?: string;
}) => {
  // 1. Search for latest market tech/tools using Firecrawl
  let marketTech = "Not available";
  try {
    const scrapeResponse = await firecrawl.scrape(`https://www.google.com/search?q=latest+technologies+and+skills+for+${encodeURIComponent(params.targetRole)}+in+${encodeURIComponent(params.industry)}+2024+2025`, {
      formats: ['markdown'],
    });
    if (scrapeResponse.success && scrapeResponse.markdown) {
      marketTech = scrapeResponse.markdown.slice(0, 3000); // Limit context
    }
  } catch (error) {
    console.error("Firecrawl search failed:", error);
  }

  // 2. Prompt OpenAI to generate the resume and analysis
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
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "You are a professional resume writer." }, { role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate resume content");
  
  return JSON.parse(content);
};

export const generateBulletPoints = async (role: string, company: string, industry: string) => {
  const prompt = `Write 3 strong, quantified resume bullet points for a ${role} at ${company} in the ${industry} industry. 
  Focus on impact, use action verbs, include metrics where possible.
  Return as a JSON array of strings. 
  Example format: ["Achieved X% increase in Y by implementing Z", "Led a team of N to deliver..."]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return [];
  const parsed = JSON.parse(content);
  return parsed.bullets || Object.values(parsed)[0] || [];
};

export const generateSummary = async (name: string, title: string, experience: string, skills: string[]) => {
  const prompt = `Write a 3-sentence professional resume summary for ${name}, a ${title} with ${experience} years of experience. 
  Key skills to include: ${skills.join(', ')}. 
  Make it impactful and professional.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content?.trim() || "";
};

export const tailorResume = async (resumeData: any, jobDescription: string) => {
  const prompt = `Compare this resume data to the following job description.
  Resume: ${JSON.stringify(resumeData)}
  Job Description: ${jobDescription}
  
  Task:
  1. Identify missing keywords for the skills section.
  2. Rewrite 3 experience bullet points to better align with the job's language.
  3. Suggest a tailored summary.
  
  Return the result as a JSON object with:
  {
    "missingKeywords": ["keyword1", "keyword2"],
    "rewrittenBullets": [{"original": "...", "suggested": "..."}],
    "suggestedSummary": "..."
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
};

export const analyzeAtsScore = async (resumeData: any, jobDescription: string) => {
  const prompt = `Analyze this resume against the job description for ATS compatibility.
  Resume: ${JSON.stringify(resumeData)}
  Job Description: ${jobDescription}
  
  Score it from 0-100.
  Identify missing keywords and weak sections.
  
  Return as JSON:
  {
    "score": 85,
    "missingKeywords": ["A", "B"],
    "weakSections": ["Summary", "Experience"],
    "feedback": "..."
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
};

export const findSkills = async (jobTitle: string) => {
  const prompt = `Return a list of 20 relevant skills for a ${jobTitle}, split into technical and soft skills.
  Return as JSON:
  {
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Skill A", "Skill B"]
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
};
