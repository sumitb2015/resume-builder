import type { Resume, ImprovementSuggestions } from '../shared/types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

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

  atsTailor: (resume: unknown, jobDescription: string, atsResult: { score: number; missingKeywords: string[]; weakSections: string[]; feedback: string }) =>
    post<{
      missingKeywords: string[];
      rewrittenBullets: { original: string; suggested: string }[];
      suggestedSummary: string;
    }>('/api/ai/ats-tailor', { resume, jobDescription, atsResult }),

  findSkills: (jobTitle: string) =>
    post<{ technical: string[]; soft: string[] }>('/api/ai/find-skills', { jobTitle }),

  uploadResume: async (file: File): Promise<{ resume: Resume; improvements: ImprovementSuggestions }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/api/parse/upload`, { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error((err as any).error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  syncLinkedIn: (text: string) =>
    post<{ resume: Resume }>('/api/parse/linkedin', { text }),

  smartFit: (resume: Resume, config: any, targetPages: number, userPrompt: string) =>
    post<{
      refactoredResume: Partial<Resume>;
      suggestedSettings: { fontSize: number; margin: number; lineHeight: number };
    }>('/api/ai/smart-fit', { resume, config, targetPages, userPrompt }),

  generateFullResume: (params: { currentRole?: string; targetRole: string; industry: string; experience: string; context?: string }) =>
    post<Resume>('/api/ai/generate-full-resume', params),

  fetchJobUrl: (url: string) =>
    post<{ text: string }>('/api/fetch-job-url', { url }),

  exportPdf: async (html: string, filename: string): Promise<Blob> => {
    const res = await fetch(`${BASE}/api/export/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Export failed' }));
      throw new Error((err as any).error || `HTTP ${res.status}`);
    }
    return res.blob();
  },
};
