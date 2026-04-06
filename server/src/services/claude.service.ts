import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
