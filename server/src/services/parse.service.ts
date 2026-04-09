import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const RESUME_SCHEMA = `{"resume":{"personal":{"name":"","title":"","email":"","phone":"","location":"","linkedin":"","website":"","summary":""},"experience":[{"id":"1","company":"","role":"","startDate":"","endDate":"","isCurrent":false,"bullets":[]}],"education":[{"id":"1","school":"","degree":"","field":"","startDate":"","endDate":"","gpa":""}],"skills":[{"id":"1","name":"","level":75}],"projects":[{"id":"1","title":"","description":"","url":"","tech":[]}],"certifications":[{"id":"1","name":"","issuer":"","date":"","url":""}],"languages":[{"id":"1","language":"","proficiency":""}],"custom":[]}}`;

const MAX_TEXT_LENGTH = 8000;

export async function extractResumeFromText(rawText: string): Promise<{ resume: any; improvements: any }> {
  const text = rawText.slice(0, MAX_TEXT_LENGTH);

  const parsePrompt = `Extract resume data from the text below. Return JSON matching this schema exactly: ${RESUME_SCHEMA}

Rules: sequential IDs ("1","2"…); skill levels expert=90 intermediate=75 beginner=50; isCurrent=true only if no end date or says "present"; bullets as individual strings; reverse-chron experience; empty string for missing fields.

Resume:
${text}`;

  const improvementsPrompt = `You are a resume coach. Read this resume and return JSON with improvement suggestions.

Return: {"improvements":{"overallFeedback":"2-3 sentence summary of quality and top areas to improve","suggestions":[{"section":"e.g. Experience – Company Name","original":"exact text from resume","suggested":"improved version","reason":"why this is better"}]}}

Up to 5 suggestions for the most impactful changes (weak bullets, generic summary, missing metrics).

Resume:
${text}`;

  const [parseRes, improvementsRes] = await Promise.all([
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: parsePrompt }],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    }),
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: improvementsPrompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    }),
  ]);

  const parsed = JSON.parse(parseRes.choices[0]?.message?.content ?? '{}');
  const improved = JSON.parse(improvementsRes.choices[0]?.message?.content ?? '{}');

  return { resume: parsed.resume, improvements: improved.improvements };
}

export async function extractResumeFromLinkedIn(markdown: string): Promise<{ resume: any }> {
  const text = markdown.slice(0, MAX_TEXT_LENGTH);

  const prompt = `Extract career information from this LinkedIn profile and return JSON matching this schema: ${RESUME_SCHEMA}

Focus only on: About, Experience, Education, Skills, Projects, Certifications, Languages sections. Ignore nav/ads/noise.
Rules: sequential IDs; skill levels default 75; use About section as summary or write one from experience; convert experience descriptions to resume-style bullets; empty string for missing fields; reverse-chron experience.

LinkedIn Profile:
${text}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}
