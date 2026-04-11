"use client";

import { useEffect, useState } from "react";

const FACTS = [
  { text: "Recruiters spend an average of 7 seconds scanning a resume before deciding whether to read further.", tag: "Resume tip" },
  { text: "75% of resumes are rejected by ATS systems before a human ever sees them — keyword matching is critical.", tag: "ATS insight" },
  { text: "Resumes with quantified achievements are 40% more likely to get shortlisted than those with only duties.", tag: "Best practice" },
  { text: "A tailored resume for a specific role outperforms a generic one by 3× in response rate.", tag: "Job search fact" },
  { text: "LinkedIn profiles with professional photos receive 21× more profile views and 36× more messages.", tag: "LinkedIn tip" },
  { text: "The ideal resume length for most professionals is one page; two pages for 10+ years of experience.", tag: "Formatting tip" },
  { text: "Using active verbs like 'led', 'built', 'reduced' makes resume bullets 30% more compelling to recruiters.", tag: "Writing tip" },
  { text: "Only 20% of job openings are publicly advertised — networking fills the rest.", tag: "Job market fact" },
  { text: "Hiring managers are 4× more likely to consider candidates referred by a current employee.", tag: "Networking tip" },
  { text: "Job seekers who follow up after applying are 10% more likely to receive an interview invitation.", tag: "Application tip" },
];

const INTERVAL_MS = 4000;

interface LoadingSpinnerProps {
  /** Text shown below the spinner dots, e.g. "Generating your resume…" */
  label?: string;
}

export default function LoadingSpinner({ label = "Building your resume…" }: LoadingSpinnerProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out → swap → fade in
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FACTS.length);
        setVisible(true);
      }, 300);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const fact = FACTS[index];

  return (
    <div className="ls-root">
      {/* Quote card */}
      <div className={`ls-card ${visible ? "ls-visible" : "ls-hidden"}`}>
        <div className="ls-bar" />
        <p className="ls-quote">&#8220;{fact.text}&#8221;</p>
        <span className="ls-tag">{fact.tag.toUpperCase()}</span>
      </div>

      {/* Spinner */}
      <div className="ls-spinner-wrap">
        <div className="ls-ring" />
        <div className="ls-dots">
          <span className="ls-dot" style={{ animationDelay: "0s" }} />
          <span className="ls-dot" style={{ animationDelay: "0.2s" }} />
          <span className="ls-dot" style={{ animationDelay: "0.4s" }} />
        </div>
        {label && <p className="ls-label">{label}</p>}
      </div>

      <style>{`
        .ls-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 2.5rem 1rem;
          width: 100%;
        }

        /* ── Quote card ── */
        .ls-card {
          max-width: 520px;
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        @media (prefers-color-scheme: dark) {
          .ls-card {
            background: #1e1e1e;
            border-color: rgba(255, 255, 255, 0.1);
          }
        }

        .ls-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ls-hidden {
          opacity: 0;
          transform: translateY(6px);
        }

        .ls-bar {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background: #3b82f6;
          margin-bottom: 0.75rem;
        }

        .ls-quote {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #111827;
          margin: 0 0 0.625rem;
          font-style: italic;
        }

        @media (prefers-color-scheme: dark) {
          .ls-quote { color: #f3f4f6; }
        }

        .ls-tag {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          color: #6b7280;
        }

        @media (prefers-color-scheme: dark) {
          .ls-tag { color: #9ca3af; }
        }

        /* ── Spinner ── */
        .ls-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.625rem;
        }

        .ls-ring {
          width: 44px;
          height: 44px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: ls-spin 0.85s linear infinite;
        }

        @media (prefers-color-scheme: dark) {
          .ls-ring {
            border-color: #374151;
            border-top-color: #60a5fa;
          }
        }

        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }

        .ls-dots {
          display: flex;
          gap: 5px;
        }

        .ls-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d1d5db;
          animation: ls-pulse 1.4s ease-in-out infinite;
        }

        @media (prefers-color-scheme: dark) {
          .ls-dot { background: #4b5563; }
        }

        @keyframes ls-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }

        .ls-label {
          font-size: 0.8125rem;
          color: #9ca3af;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
