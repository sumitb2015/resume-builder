import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
