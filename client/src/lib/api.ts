const BASE = 'http://localhost:3001';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  generateBullets: (role: string, company: string, industry: string) =>
    post<{ bullets: string[] }>('/api/ai/generate-bullets', { role, company, industry }),

  generateSummary: (name: string, title: string, experience: string, skills: string[]) =>
    post<{ summary: string }>('/api/ai/generate-summary', { name, title, experience, skills }),

  tailorResume: (resume: unknown, jobDescription: string) =>
    post<{
      missingKeywords: string[];
      rewrittenBullets: { original: string; suggested: string }[];
      suggestedSummary: string;
    }>('/api/ai/tailor-resume', { resume, jobDescription }),

  atsScore: (resume: unknown, jobDescription: string) =>
    post<{
      score: number;
      missingKeywords: string[];
      weakSections: string[];
      feedback: string;
    }>('/api/ai/ats-score', { resume, jobDescription }),

  findSkills: (jobTitle: string) =>
    post<{ technical: string[]; soft: string[] }>('/api/ai/find-skills', { jobTitle }),
};
