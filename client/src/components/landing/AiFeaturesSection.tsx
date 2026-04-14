import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const AI_FEATURES = [
  {
    icon: '✍️',
    title: 'Bullet Point Writer',
    desc: 'Generate 3 powerful, metrics-driven bullet points for any role. Just provide the job title and company.',
    color: '#6366F1',
    demo: 'bullets',
  },
  {
    icon: '🎯',
    title: 'Job Tailor',
    desc: 'Paste any job description and AI rewrites your bullets and summary to match the exact language.',
    color: '#8B5CF6',
    demo: 'tailor',
  },
  {
    icon: '📊',
    title: 'ATS Score',
    desc: 'Get an instant 0-100 ATS compatibility score with specific feedback on missing keywords and weak sections.',
    color: '#A855F7',
    demo: 'ats',
  },
  {
    icon: '💡',
    title: 'Summary Writer',
    desc: 'Generate a compelling 3-sentence professional summary that captures your unique value proposition.',
    color: '#EC4899',
    demo: 'summary',
  },
  {
    icon: '🔍',
    title: 'Skills Finder',
    desc: 'Enter your job title and instantly get 20 relevant skills split into technical and soft categories.',
    color: '#F59E0B',
    demo: 'skills',
  },
  {
    icon: '✉️',
    title: 'Cover Letter',
    desc: 'Generate a tailored cover letter that connects your experience to the job requirements in seconds.',
    color: '#3B82F6',
    demo: 'coverLetter',
  },
  {
    icon: '🤝',
    title: 'Interview Prep',
    desc: 'Get a list of 8+ likely interview questions and suggested answers based on your resume and the JD.',
    color: '#F43F5E',
    demo: 'interview',
  },
  {
    icon: '🔄',
    title: 'Diff Review',
    desc: 'See exactly what changed before/after job tailoring with a clear before/after comparison view.',
    color: '#10B981',
    demo: 'diff',
  },
];

// Demo panels use a fixed dark theme — they simulate the app's dark UI preview
const demoPanelBase: React.CSSProperties = {
  background: '#0D1117', color: 'rgba(255,255,255,0.92)',
};

const BulletsDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Generated bullets</div>
    {['• Increased revenue by 32% through targeted campaign optimization', '• Led cross-functional team of 8 engineers to ship v3.0 ahead of schedule', '• Reduced churn by 18% by implementing new onboarding flow'].map((b, i) => (
      <div key={i} style={{ fontSize: '10.5px', color: i === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
        <span style={{ color, flexShrink: 0 }}>›</span>{b.slice(2)}
      </div>
    ))}
  </div>
);

const TailorDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
    <div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Job Keywords</div>
      {['TypeScript', 'React', 'Node.js', 'REST API', 'Agile'].map(k => (
        <div key={k} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: color + '20', color: color, border: `1px solid ${color}40`, marginBottom: '4px', display: 'inline-block', marginRight: '4px' }}>{k}</div>
      ))}
    </div>
    <div>
      <div style={{ fontSize: '9px', color: '#4ADE80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Matched ✓</div>
      {['TypeScript', 'React', 'REST API'].map(k => (
        <div key={k} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.25)', marginBottom: '4px', display: 'inline-block', marginRight: '4px' }}>{k}</div>
      ))}
    </div>
  </div>
);

const AtsDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
    <div style={{ position: 'relative', width: '72px', height: '72px' }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: `conic-gradient(${color} 0deg, ${color} ${87 * 3.6}deg, rgba(255,255,255,0.06) ${87 * 3.6}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#0D1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1 }}>87</span>
          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.60)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>
    </div>
    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.80)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ color: '#4ADE80', fontWeight: 600 }}>✓ Strong keywords</div>
      <div style={{ color: '#F59E0B', fontWeight: 600 }}>⚠ Add more metrics</div>
      <div style={{ color: 'rgba(255,255,255,0.55)' }}>Missing: Agile, REST</div>
    </div>
  </div>
);

const SummaryDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>AI-generated summary</div>
    <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.7 }}>
      Results-driven Product Manager with 7+ years leading cross-functional teams at hyper-growth startups.{' '}
      <span style={{ color }}>Shipped 3 zero-to-one products</span> generating $12M ARR combined.{' '}
      Passionate about data-informed decisions and building products users love.
      <span style={{ display: 'inline-block', width: '2px', height: '12px', background: color, marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
    </p>
  </div>
);

const SkillsDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '14px', height: '100%' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>For: Senior Frontend Engineer</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
      {['React', 'TypeScript', 'GraphQL', 'CSS', 'Testing', 'Performance', 'Next.js', 'Git', 'Communication', 'Agile'].map(s => (
        <span key={s} style={{
          fontSize: '10px', padding: '3px 8px', borderRadius: '5px',
          background: color + '18', color: color, border: `1px solid ${color}30`, fontWeight: 500,
        }}>
          {s}
        </span>
      ))}
    </div>
  </div>
);

const CoverLetterDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Dear Hiring Manager,</div>
    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
      I am writing to express my strong interest in the <span style={{ color, fontWeight: 600 }}>Senior Developer</span> role. 
      My experience with <span style={{ color, fontWeight: 600 }}>React and Node.js</span> aligns perfectly with your requirements for...
    </p>
    <div style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '4px', background: color + '15', border: `1px solid ${color}30`, display: 'inline-block', fontSize: '9px', color: color, fontWeight: 600 }}>
      Tailored to: Google J.D.
    </div>
  </div>
);

const InterviewDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '14px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Q: Tell me about a time you...</div>
    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: '9px', color: color, fontWeight: 700, marginBottom: '4px' }}>Suggested Answer Strategy</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.4 }}>
        Focus on the $2M cost saving project you led in 2023. Use the STAR method to highlight...
      </div>
    </div>
  </div>
);

const ExpertDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: color + '20', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
      👨‍💼
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '10px', color: 'white', fontWeight: 600, marginBottom: '2px' }}>Expert Feedback</div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.80)', fontStyle: 'italic' }}>
        "Your header is strong, but let's reword the 'Cloud Architect' section to emphasize..."
      </div>
    </div>
  </div>
);

const DiffDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Before → After</div>
    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)' }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', textDecoration: 'line-through' }}>Worked on improving user experience for the product team.</span>
    </div>
    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.95)' }}>Led UX redesign reducing user drop-off by <strong style={{ color }}>34%</strong>, directly contributing to 2× increase in activation rate.</span>
    </div>
  </div>
);

const DEMO_PANELS: Record<string, React.FC<{ color: string }>> = {
  bullets: BulletsDemoPanel,
  tailor: TailorDemoPanel,
  ats: AtsDemoPanel,
  summary: SummaryDemoPanel,
  skills: SkillsDemoPanel,
  coverLetter: CoverLetterDemoPanel,
  interview: InterviewDemoPanel,
  expert: ExpertDemoPanel,
  diff: DiffDemoPanel,
};

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Choose a Template',
    desc: 'Select from 40+ ATS-optimized templates designed by recruitment experts.',
    color: '#6366F1',
    icon: '🎨',
    demo: 'skills', // Reuse existing demo panels for visual depth
  },
  {
    step: '02',
    title: 'AI Writing Suite',
    desc: 'Generate powerful bullet points and professional summaries in seconds.',
    color: '#8B5CF6',
    icon: '✍️',
    demo: 'bullets',
  },
  {
    step: '03',
    title: 'ATS Optimization',
    desc: 'Get an instant compatibility score and match your resume to any job description.',
    color: '#A855F7',
    icon: '🎯',
    demo: 'ats',
  },
  {
    step: '04',
    title: 'Export & Land the Job',
    desc: 'Download your pixel-perfect PDF and use AI to prepare for the interview.',
    color: '#EC4899',
    icon: '🚀',
    demo: 'interview',
  },
];

const StepCard: React.FC<{ step: typeof WORKFLOW_STEPS[0] }> = ({ step }) => {
  const DemoPanel = DEMO_PANELS[step.demo];
  return (
    <div
      style={{
        borderRadius: '24px', overflow: 'hidden',
        background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = step.color + '50';
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -12px ${step.color}25`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-ui-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ padding: '32px 32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: step.color, letterSpacing: '0.1em' }}>STEP {step.step}</span>
          <span style={{ fontSize: '24px' }}>{step.icon}</span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px' }}>{step.title}</h3>
        <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, marginBottom: '0' }}>{step.desc}</p>
      </div>
      <div style={{ flex: 1, minHeight: '140px', borderTop: '1px solid var(--color-ui-border)', overflow: 'hidden' }}>
        <DemoPanel color={step.color} />
      </div>
    </div>
  );
};

const AiFeaturesSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024 && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="ai-features" style={{
      padding: isMobile ? '80px 20px' : '120px 48px',
      background: 'var(--color-ui-bg)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '56px' : '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: '20px',
          }}>
            <Sparkles size={13} color="#818CF8" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#818CF8', letterSpacing: '0.05em' }}>THE WORKFLOW</span>
          </div>
          <h2 style={{ fontSize: isMobile ? '32px' : 'clamp(36px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-ui-text)', marginBottom: '20px', lineHeight: 1.1 }}>
            Your path to a <span style={{ color: '#818CF8' }}>better career</span>
          </h2>
          <p style={{ fontSize: isMobile ? '16px' : '19px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            BespokeCV simplifies the job hunt into four powerful steps, using AI to give you an unfair advantage.
          </p>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? (isTablet ? 'repeat(2, 1fr)' : '1fr') : 'repeat(4, 1fr)', 
          gap: '24px' 
        }}>
          {WORKFLOW_STEPS.map((s, i) => <StepCard key={i} step={s} />)}
        </div>
      </div>
    </section>
  );
};

export default AiFeaturesSection;
