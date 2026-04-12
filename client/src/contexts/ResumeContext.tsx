import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Resume, TemplateConfig, ImprovementSuggestions } from '../shared/types';
import { templates } from '../templates';
import { legacyMarkdownToHtml } from '../lib/htmlUtils';
import { useAuth } from './AuthContext';

interface ResumeContextType {
  resume: Resume;
  setResume: (r: Resume | ((prev: Resume) => Resume)) => void;
  activeTemplate: TemplateConfig;
  setActiveTemplate: React.Dispatch<React.SetStateAction<TemplateConfig>>;
  improvements: ImprovementSuggestions | null;
  setImprovements: React.Dispatch<React.SetStateAction<ImprovementSuggestions | null>>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentResumeId: string | null;
  setCurrentResumeId: React.Dispatch<React.SetStateAction<string | null>>;
  handleNewResume: () => void;
  loadResume: (saved: any) => void;
  clearDraft: () => void;
}

function draftKey(uid: string | null) {
  return uid ? `bespokecv_draft_${uid}` : 'bespokecv_draft_anonymous';
}

function loadDraft(uid: string | null): { resume: Resume; templateId: string } | null {
  try {
    const raw = localStorage.getItem(draftKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const initialResume: Resume = {
  personal: {
    name: 'ALEX MORGAN',
    title: 'Senior Product Designer',
    email: 'alex@morgan.dev',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    website: 'alexmorgan.design',
    summary: 'Multi-disciplinary designer with 10+ years crafting digital products used by millions. Expert in UX/UI design, design systems, and product strategy with a track record of improving user retention and engagement.',
  },
  experience: [
    {
      id: '1',
      company: 'Stripe',
      role: 'Lead Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Led redesign of the core payments dashboard, increasing user task completion by 42%.',
        'Built and maintained a comprehensive design system adopted by 80+ engineers across 6 teams.',
        'Mentored 4 junior designers and established design critique culture used company-wide.',
      ],
    },
    {
      id: '2',
      company: 'Airbnb',
      role: 'Senior UX Designer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      isCurrent: false,
      bullets: [
        'Redesigned the host onboarding flow, reducing drop-off rate by 28% and increasing listings by 15K/month.',
        'Collaborated with data science to create A/B testing framework for design decisions.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Carnegie Mellon University',
      degree: 'M.Des.',
      field: 'Interaction Design',
      startDate: 'Aug 2015',
      endDate: 'May 2017',
      gpa: '3.9',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 100 },
    { id: '2', name: 'Product Strategy', level: 90 },
    { id: '3', name: 'Design Systems', level: 95 },
    { id: '4', name: 'User Research', level: 85 },
    { id: '5', name: 'Prototyping', level: 90 },
  ],
  projects: [
    { id: '1', title: 'OpenDesign', description: 'Open-source design system with 200+ components used by 5k+ developers.', url: 'github.com/alexm/opendesign', tech: ['Figma', 'React', 'Storybook'] },
  ],
  certifications: [],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Intermediate' },
  ],
  custom: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function migrateResume(resume: Resume): Resume {
  return {
    ...resume,
    personal: { ...resume.personal, summary: legacyMarkdownToHtml(resume.personal.summary) },
    experience: resume.experience.map(exp => ({ ...exp, bullets: exp.bullets.map(legacyMarkdownToHtml) })),
    projects: resume.projects.map(p => ({ ...p, description: legacyMarkdownToHtml(p.description) })),
  };
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? null;

  const [resume, setResumeState] = useState<Resume>(initialResume);
  const [activeTemplate, setActiveTemplate] = useState<TemplateConfig>({ ...templates[1]! });
  const [improvements, setImprovements] = useState<ImprovementSuggestions | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Load draft after auth resolves (uid changes from null → user uid after login)
  useEffect(() => {
    const draft = loadDraft(uid);
    if (!draft?.resume) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResumeState(migrateResume(draft.resume));
    if (draft.templateId) {
      const tpl = templates.find(t => t.id === draft.templateId);
      if (tpl) setActiveTemplate({ ...tpl });
    }
  }, [uid]);

  // Undo/Redo history
  const historyRef = useRef<Resume[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoingRef = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = (r: Resume) => {
    if (isUndoingRef.current) return;
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(r)));
    if (historyRef.current.length > 40) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  };

  // Debounced autosave — writes current resume+template to localStorage 1.5s after last change
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(uid), JSON.stringify({ resume, templateId: activeTemplate.id }));
      } catch { /* ignore localStorage quota errors */ }
    }, 1500);
    return () => { if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current); };
  }, [resume, activeTemplate, uid]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey(uid));
  }, [uid]);

  const setResume = (r: Resume | ((prev: Resume) => Resume)) => {
    setResumeState(prev => {
      const next = typeof r === 'function' ? r(prev) : r;
      pushHistory(next);
      return next;
    });
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    isUndoingRef.current = true;
    setResumeState(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    isUndoingRef.current = true;
    setResumeState(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const handleNewResume = () => {
    localStorage.removeItem(draftKey(uid));
    setResumeState(initialResume);
    setActiveTemplate({ ...templates[1]! });
    setCurrentResumeId(null);
    setImprovements(null);
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  };

  const loadResume = (saved: any) => {
    const migrated = migrateResume(saved.resumeData);
    setResumeState(migrated);
    const tpl = templates.find(t => t.id === saved.templateId);
    if (tpl) setActiveTemplate({ ...tpl });
    setCurrentResumeId(saved.id);
    setImprovements(null);
    historyRef.current = [JSON.parse(JSON.stringify(migrated))];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  };

  return (
    <ResumeContext.Provider value={{
      resume, setResume, activeTemplate, setActiveTemplate, improvements, setImprovements,
      undo, redo, canUndo, canRedo, currentResumeId, setCurrentResumeId, handleNewResume, loadResume, clearDraft
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
