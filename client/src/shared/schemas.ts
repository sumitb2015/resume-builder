import { z } from 'zod';

// ── Leaf schemas ─────────────────────────────────────────────────────────────

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isCurrent: z.boolean(),
  bullets: z.array(z.string()),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string(),
});

export const SkillEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number(),
});

export const ProjectEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  tech: z.array(z.string()),
});

export const CertificationEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string(),
});

export const LanguageEntrySchema = z.object({
  id: z.string(),
  language: z.string(),
  proficiency: z.string(),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  sectionTitle: z.string(),
  entries: z.array(z.string()),
});

// ── Resume ───────────────────────────────────────────────────────────────────

export const ResumeSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string(),
    website: z.string(),
    summary: z.string(),
    photoUrl: z.string().optional(),
  }),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  skills: z.array(SkillEntrySchema),
  projects: z.array(ProjectEntrySchema),
  certifications: z.array(CertificationEntrySchema),
  languages: z.array(LanguageEntrySchema),
  custom: z.array(CustomSectionSchema),
});

// ── ImprovementSuggestions ───────────────────────────────────────────────────

export const ImprovementSuggestionSchema = z.object({
  section: z.string(),
  original: z.string(),
  suggested: z.string(),
  reason: z.string(),
});

export const ImprovementSuggestionsSchema = z.object({
  overallFeedback: z.string(),
  suggestions: z.array(ImprovementSuggestionSchema),
});

// ── Composite API response schemas ───────────────────────────────────────────

export const UploadResumeResponseSchema = z.object({
  resume: ResumeSchema,
  improvements: ImprovementSuggestionsSchema,
});

export const LinkedInResponseSchema = z.object({
  resume: ResumeSchema,
});

export const SmartResumeResponseSchema = z.object({
  resume: ResumeSchema,
  analysis: z.object({
    addedTechnologies: z.array(z.string()),
    changesMade: z.array(z.string()),
  }),
});
