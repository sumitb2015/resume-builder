import type { Resume, ImprovementSuggestions, SmartResumeResponse } from '../shared/types';
import {
  UploadResumeResponseSchema,
  LinkedInResponseSchema,
  SmartResumeResponseSchema,
} from '../shared/schemas';
import { auth } from './firebase';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Helper to get authorization headers including the Firebase ID token
async function getAuthHeaders(): Promise<Record<string, string>> {
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

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function post<T>(path: string, body: unknown, options: { retryable?: boolean } = {}): Promise<T> {
  const { retryable = true } = options;
  const TIMEOUT_MS = 30_000;
  const delays = [1000, 2000];
  const maxRetries = retryable ? 2 : 0;
  let lastError: Error = new Error('Request failed');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await sleep(delays[attempt - 1]!);

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(tid);
      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After');
          const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
          throw new Error(`Rate limit reached — too many AI requests. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} and try again.`);
        }
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return res.json();
    } catch (err: unknown) {
      clearTimeout(tid);
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      const isNetwork = err instanceof TypeError;
      if ((!isAbort && !isNetwork) || attempt >= maxRetries) {
        if (isAbort) throw new Error('Request timed out — please try again.');
        throw err instanceof Error ? err : new Error('Request failed');
      }
      lastError = err instanceof Error ? err : new Error('Request failed');
      console.warn(`[api] Attempt ${attempt + 1} failed, retrying…`, err);
    }
  }
  throw lastError;
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
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch(`${BASE}/api/parse/upload`, {
        method: 'POST',
        headers: { ...authHeaders },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(tid);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error((err as any).error || `HTTP ${res.status}`);
      }
      return UploadResumeResponseSchema.parse(await res.json());
    } catch (err: unknown) {
      clearTimeout(tid);
      if (err instanceof DOMException && err.name === 'AbortError')
        throw new Error('Upload timed out — please try again.');
      throw err;
    }
  },

  syncLinkedIn: async (text: string): Promise<{ resume: Resume }> => {
    const raw = await post<{ resume: Resume }>('/api/parse/linkedin', { text });
    return LinkedInResponseSchema.parse(raw);
  },

  smartFit: (resume: Resume, config: any, targetPages: number, userPrompt: string) =>
    post<{
      refactoredResume: Partial<Resume>;
      suggestedSettings: { fontSize: number; margin: number; lineHeight: number };
      modifiedFields?: string[];
    }>('/api/ai/smart-fit', { resume, config, targetPages, userPrompt }),

  generateFullResume: (params: { currentRole?: string; targetRole: string; industry: string; experience: string; context?: string }) =>
    post<Resume>('/api/ai/generate-full-resume', params),

  generateSmartResume: async (params: {
    targetRole: string;
    industry: string;
    currentRole?: string;
    experience: string;
    context?: string;
    education?: string;
    achievements?: string;
  }): Promise<SmartResumeResponse> => {
    const raw = await post<SmartResumeResponse>('/api/ai/generate-smart-resume', params);
    return SmartResumeResponseSchema.parse(raw);
  },

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
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch(`${BASE}/api/export/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ html, filename }),
        signal: controller.signal,
      });
      clearTimeout(tid);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Export failed' }));
        throw new Error((err as any).error || `HTTP ${res.status}`);
      }
      return res.blob();
    } catch (err: unknown) {
      clearTimeout(tid);
      if (err instanceof DOMException && err.name === 'AbortError')
        throw new Error('PDF export timed out — please try again.');
      throw err;
    }
  },
};
