export interface Resume {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
    photoUrl?: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  custom: CustomSection[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  level: number; // 0-100 for progress bars
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  entries: string[];
}

export interface ImprovementSuggestion {
  section: string;
  original: string;
  suggested: string;
  reason: string;
}

export interface ImprovementSuggestions {
  overallFeedback: string;
  suggestions: ImprovementSuggestion[];
}

export interface SmartResumeResponse {
  resume: Resume;
  analysis: {
    addedTechnologies: string[];
    changesMade: string[];
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  thumbnail: string;
  colors: {
    primary: string;
    accent: string;
    text: string;
    background: string;
    sidebar?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'two-column' | 'single-column';
  atsScore: number;
  category: 'professional' | 'creative' | 'minimal';
  settings?: {
    margin: number;      // mm - page outer margin (applied as .resume-paper padding)
    fontSize: number;    // % - global font scale (100 = 100%)
    lineHeight: number;  // line height ratio (e.g. 1.5)
    padding?: number;    // mm - kept for backward compatibility
  };
}
