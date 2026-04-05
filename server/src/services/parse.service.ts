import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractResumeFromText(rawText: string): Promise<{ resume: any; improvements: any }> {
  const prompt = `You are a professional resume parser. Extract all information from the resume text below and return structured JSON.

Resume Text:
${rawText}

Return ONLY valid JSON with this exact structure:
{
  "resume": {
    "personal": {
      "name": "",
      "title": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "website": "",
      "summary": ""
    },
    "experience": [
      {
        "id": "1",
        "company": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "isCurrent": false,
        "bullets": []
      }
    ],
    "education": [
      {
        "id": "1",
        "school": "",
        "degree": "",
        "field": "",
        "startDate": "",
        "endDate": "",
        "gpa": ""
      }
    ],
    "skills": [
      { "id": "1", "name": "", "level": 75 }
    ],
    "projects": [
      { "id": "1", "title": "", "description": "", "url": "", "tech": [] }
    ],
    "certifications": [
      { "id": "1", "name": "", "issuer": "", "date": "", "url": "" }
    ],
    "languages": [
      { "id": "1", "language": "", "proficiency": "" }
    ],
    "custom": []
  },
  "improvements": {
    "overallFeedback": "2-3 sentences summarizing the resume quality and top areas to improve",
    "suggestions": [
      {
        "section": "e.g. Experience – Company Name",
        "original": "exact text from the resume",
        "suggested": "improved version of the text",
        "reason": "brief explanation of why this is better"
      }
    ]
  }
}

Rules:
- Use sequential IDs: "1", "2", "3"
- Skill levels: expert/advanced=90, intermediate=75, beginner=50
- For isCurrent: true only if no end date or explicitly says "present"
- Extract all bullet points from experience as individual strings in the bullets array
- Provide up to 5 improvement suggestions for the most impactful changes (weak bullets, generic summary, missing metrics)
- Leave fields as empty strings if not found — do not omit them
- Keep experience entries in reverse chronological order`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}

export async function extractResumeFromLinkedIn(markdown: string): Promise<{ resume: any }> {
  const prompt = `You are a professional resume builder. Extract career information from this LinkedIn profile page content and structure it as a resume.

LinkedIn Profile Content:
${markdown}

The content may include navigation elements, ads, and other noise — focus only on the profile sections: About, Experience, Education, Skills, Projects, Certifications, Languages.

Return ONLY valid JSON with this exact structure:
{
  "resume": {
    "personal": {
      "name": "",
      "title": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "website": "",
      "summary": ""
    },
    "experience": [
      {
        "id": "1",
        "company": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "isCurrent": false,
        "bullets": []
      }
    ],
    "education": [
      {
        "id": "1",
        "school": "",
        "degree": "",
        "field": "",
        "startDate": "",
        "endDate": "",
        "gpa": ""
      }
    ],
    "skills": [
      { "id": "1", "name": "", "level": 75 }
    ],
    "projects": [
      { "id": "1", "title": "", "description": "", "url": "", "tech": [] }
    ],
    "certifications": [
      { "id": "1", "name": "", "issuer": "", "date": "", "url": "" }
    ],
    "languages": [
      { "id": "1", "language": "", "proficiency": "" }
    ],
    "custom": []
  }
}

Rules:
- Use sequential IDs: "1", "2", "3"
- Skill levels: estimate based on endorsements or context — default to 75
- For the summary, use the LinkedIn "About" section if available; otherwise write a brief professional summary from the experience
- Convert LinkedIn experience descriptions into resume-style bullet points
- Leave fields as empty strings if not found
- Keep experience in reverse chronological order`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}
