import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  // General
  {
    category: 'General',
    question: 'What is BespokeCV?',
    answer: 'BespokeCV is an AI-powered resume builder that helps you create polished, ATS-optimized resumes in minutes. It combines professional templates with AI tools — bullet point writing, job tailoring, ATS scoring, and more — so your resume stands out to both recruiters and automated screening systems.',
  },
  {
    category: 'General',
    question: 'Do I need to create an account to get started?',
    answer: 'Yes, a free account is required to start building. This ensures your progress is automatically saved securely, allowing you to access and edit your resumes across different devices and sessions without losing your work.',
  },
  {
    category: 'General',
    question: 'How long does it take to build a resume?',
    answer: 'Most users create a polished, ready-to-send resume in under 15 minutes. If you import an existing resume or LinkedIn profile, much of the form is pre-filled automatically — you just review and refine.',
  },
  {
    category: 'General',
    question: 'What file formats can I export?',
    answer: 'BespokeCV exports pixel-perfect A4 PDFs via server-side rendering — the same layout you see in the live preview. DOCX export is not currently supported, but A4 PDF is the industry standard for resume submissions.',
  },

  // Modes
  {
    category: 'Getting Started',
    question: 'What are the different ways to start building my resume?',
    answer: 'There are three modes:\n\n• Manual — Start from scratch with a guided editor and sample data pre-filled as a reference.\n• Enhance — Upload an existing PDF or DOCX resume. AI parses it, pre-fills your resume, and surfaces specific improvement suggestions.\n• LinkedIn — Paste your LinkedIn profile text and AI converts it into a structured resume automatically.',
  },
  {
    category: 'Getting Started',
    question: 'How does the LinkedIn import work?',
    answer: 'Go to your LinkedIn profile, select all the text on the page (Ctrl+A / Cmd+A), copy it, and paste it into the LinkedIn import field. AI reads the raw text and extracts your experience, education, skills, and summary into the resume editor.',
  },
  {
    category: 'Getting Started',
    question: 'Can I upload my existing resume?',
    answer: 'Yes. The Enhance mode accepts PDF and DOCX files. AI parses the content, fills in your resume, and also returns a list of improvement suggestions — things like weak bullets, missing metrics, or sections that need strengthening. You can apply these suggestions with a single click.',
  },

  // Features
  {
    category: 'Features',
    question: 'What AI features are available?',
    answer: 'BespokeCV includes six AI tools:\n\n• Bullet Point Writer — generates 3 metrics-driven bullets for any role\n• Summary Writer — writes a 3-sentence professional summary\n• Job Tailor — rewrites your resume to match a specific job description\n• ATS Score — rates your resume 0–100 with keyword and section feedback\n• Skills Finder — suggests 20 relevant skills for your job title\n• Diff Review — shows exactly what changed before and after tailoring',
  },
  {
    category: 'Features',
    question: 'What is an ATS score and why does it matter?',
    answer: 'ATS stands for Applicant Tracking System — software used by most companies to filter resumes before a human ever sees them. Your ATS score (0–100) shows how well your resume passes these filters. A higher score means more keyword alignment, better formatting, and stronger section coverage. Scores below 70 typically indicate missing keywords or weak sections that can be fixed in minutes.',
  },
  {
    category: 'Features',
    question: 'What does Job Tailor do exactly?',
    answer: 'Job Tailor takes a job description you paste and rewrites your experience bullets and professional summary to match the job\'s exact language, keywords, and requirements. This significantly improves both ATS scores and the impression you make on recruiters reading that specific role.',
  },
  {
    category: 'Features',
    question: 'How many resume templates are available?',
    answer: 'There are 40+ professional templates ranging from minimal single-column layouts to two-column executive designs. Basic plan users get access to 3 templates; Pro and Ultimate unlock all 40+. Every template is A4-sized and fully ATS-compatible.',
  },
  {
    category: 'Features',
    question: 'Can I customize colors and fonts?',
    answer: 'Yes. The Style panel (accessible from the toolbar) lets you switch templates, pick from curated color palettes, and adjust preview zoom. Color customization is available on Pro and Ultimate plans.',
  },

  // Pricing
  {
    category: 'Pricing',
    question: 'What plans are available?',
    answer: 'There are three plans:\n\n• Basic (₹199 / 14 days) — 3 templates, live editor, PDF export (1/day), template-based ATS score, AI bullets (3/day)\n• Pro (₹499 / mo) — All 40+ templates, unlimited PDF exports, dynamic ATS with JD matching, unlimited AI bullets, summary writer, skills finder, resume import\n• Ultimate (₹699 / mo) — Everything in Pro plus job tailoring, LinkedIn import, diff review, AI improvement suggestions, email support, drag & drop reordering',
  },
  {
    category: 'Pricing',
    question: 'Is there a free trial?',
    answer: 'The Basic plan at ₹199 is a 14-day trial that covers the core features — editor, templates, PDF export, and basic AI bullets. No long-term commitment required.',
  },
  {
    category: 'Pricing',
    question: 'Can I cancel anytime?',
    answer: 'Yes. There are no long-term contracts. You can cancel your subscription at any time and you\'ll retain access until the end of your billing period.',
  },
  {
    category: 'Pricing',
    question: 'What is the difference between the Basic ATS score and the Pro dynamic ATS score?',
    answer: 'The Basic ATS score is template-based — it evaluates your resume structure and formatting. The Pro and Ultimate dynamic ATS score goes further: you paste a specific job description and AI compares your resume against that exact JD, flagging missing keywords, weak sections, and alignment gaps in real time.',
  },
];

const CATEGORIES = ['General', 'Getting Started', 'Features', 'Pricing'];

const FaqItem: React.FC<{ item: FaqItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div
    style={{
      borderRadius: '12px',
      border: `1px solid ${isOpen ? 'rgba(99,102,241,0.35)' : 'var(--color-ui-border)'}`,
      background: isOpen ? 'rgba(99,102,241,0.04)' : 'var(--color-ui-surface)',
      transition: 'border-color 0.2s, background 0.2s',
      overflow: 'hidden',
    }}
  >
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer',
        textAlign: 'left', gap: '16px',
      }}
    >
      <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-ui-text)', lineHeight: 1.4 }}>
        {item.question}
      </span>
      <ChevronDown
        size={16}
        color="var(--color-ui-text-muted)"
        style={{ flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      />
    </button>

    {isOpen && (
      <div style={{ padding: '0 22px 20px' }}>
        <div style={{ height: '1px', background: 'var(--color-ui-border)', marginBottom: '16px' }} />
        <p style={{
          fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.75,
          whiteSpace: 'pre-line', margin: 0,
        }}>
          {item.answer}
        </p>
      </div>
    )}
  </div>
);

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('General');

  const filtered = FAQS.filter(f => f.category === activeCategory);

  return (
    <section id="faq" style={{ padding: '100px 48px', borderTop: '1px solid var(--color-ui-border)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.04em' }}>FAQ</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)' }}>
            Everything you need to know about BespokeCV.
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              style={{
                padding: '7px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                border: activeCategory === cat ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--color-ui-border)',
                background: activeCategory === cat ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: activeCategory === cat ? '#818CF8' : 'var(--color-ui-text-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((item, i) => (
            <FaqItem
              key={`${activeCategory}-${i}`}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
