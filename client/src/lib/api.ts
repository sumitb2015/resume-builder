import type { Resume, ImprovementSuggestions, SmartResumeResponse } from '../shared/types';
import { auth } from './firebase';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Helper to get authorization headers including the Firebase ID token
async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return { 'Authorization': `Bearer ${token}` };
  } catch (err) {
    console.error('Failed to get auth token:', err);
    return {};
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeaders
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // ... (rest of the methods)
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

  generateCoverLetter: (resume: unknown, jobDescription: string) =>
    post<{ text: string }>('/api/ai/generate-cover-letter', { resume, jobDescription }),

  generateInterviewPrep: (resume: unknown, jobDescription: string) =>
    post<{
      analysis: string;
      questions: { question: string; type: string; strategy: string; sampleAnswer: string }[];
    }>('/api/ai/generate-interview-prep', { resume, jobDescription }),

  requestExpertReview: (userId: string, resumeId: string | null, resumeData: any, comments: string) =>
    post<{ success: boolean; id: string }>('/api/user/request-review', { userId, resumeId, resumeData, comments }),

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
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE}/api/parse/upload`, { 
      method: 'POST', 
      headers: { ...authHeaders },
      body: formData 
    });
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
      modifiedFields?: string[];
    }>('/api/ai/smart-fit', { resume, config, targetPages, userPrompt }),

  generateFullResume: (params: { currentRole?: string; targetRole: string; industry: string; experience: string; context?: string }) =>
    post<Resume>('/api/ai/generate-full-resume', params),

  generateSmartResume: (params: {
    targetRole: string;
    industry: string;
    currentRole?: string;
    experience: string;
    context?: string;
    education?: string;
    achievements?: string;
  }) => post<SmartResumeResponse>('/api/ai/generate-smart-resume', params),

  rephrase: (text: string, instruction?: string) =>
    post<{ text: string }>('/api/ai/rephrase', { text, instruction }),

  fetchJobUrl: (url: string) =>
    post<{ text: string }>('/api/fetch-job-url', { url }),

  validateDiscount: (code: string) =>
    post<{ valid: boolean; discountPercent: number; message?: string }>('/api/payment/validate-discount', { code }),

  createOrder: (params: { 
    userId: string; 
    planTier: string; 
    isAnnual: boolean; 
    discountCode?: string;
    currency?: string; 
  }) =>
    post<{ id: string; amount: number; currency: string }>('/api/payment/create-order', params),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planTier: string;
    userId: string;
    isAnnual: boolean;
  }) => post<{ success: boolean; message: string }>('/api/payment/verify', data),

  syncUser: (uid: string, email?: string, displayName?: string) =>
    post<{ plan: string }>('/api/user/sync', { uid, email, displayName }),

  getUserProfile: async (uid: string) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE}/api/user/me/${uid}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Fetch profile failed' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  saveAtsHistory: (data: { userId: string; resumeId: string | null; score: number; jobTitle?: string; company?: string }) =>
    post<{ success: boolean; id: string }>('/api/user/ats-history', data),

  exportPdf: async (html: string, filename: string): Promise<Blob> => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE}/api/export/pdf`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ html, filename }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Export failed' }));
      throw new Error((err as any).error || `HTTP ${res.status}`);
    }
    return res.blob();
  },
};
