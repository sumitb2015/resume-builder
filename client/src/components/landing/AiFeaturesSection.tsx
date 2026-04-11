import React from 'react';
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
    icon: '👨‍🏫',
    title: 'Expert Review',
    desc: 'Get your resume reviewed by a human expert for personalized feedback on strategy and wording.',
    color: '#14B8A6',
    demo: 'expert',
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
  background: '#0D1117', color: 'rgba(255,255,255,0.7)',
};

const BulletsDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Generated bullets</div>
    {['• Increased revenue by 32% through targeted campaign optimization', '• Led cross-functional team of 8 engineers to ship v3.0 ahead of schedule', '• Reduced churn by 18% by implementing new onboarding flow'].map((b, i) => (
      <div key={i} style={{ fontSize: '10.5px', color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
        <span style={{ color, flexShrink: 0 }}>›</span>{b.slice(2)}
      </div>
    ))}
  </div>
);

const TailorDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
    <div>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Job Keywords</div>
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
          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>
    </div>
    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ color: '#4ADE80', fontWeight: 600 }}>✓ Strong keywords</div>
      <div style={{ color: '#F59E0B', fontWeight: 600 }}>⚠ Add more metrics</div>
      <div style={{ color: 'rgba(255,255,255,0.35)' }}>Missing: Agile, REST</div>
    </div>
  </div>
);

const SummaryDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>AI-generated summary</div>
    <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
      Results-driven Product Manager with 7+ years leading cross-functional teams at hyper-growth startups.{' '}
      <span style={{ color }}>Shipped 3 zero-to-one products</span> generating $12M ARR combined.{' '}
      Passionate about data-informed decisions and building products users love.
      <span style={{ display: 'inline-block', width: '2px', height: '12px', background: color, marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
    </p>
  </div>
);

const SkillsDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '14px', height: '100%' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>For: Senior Frontend Engineer</div>
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
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Dear Hiring Manager,</div>
    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
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
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Q: Tell me about a time you...</div>
    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: '9px', color: color, fontWeight: 700, marginBottom: '4px' }}>Suggested Answer Strategy</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
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
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
        "Your header is strong, but let's reword the 'Cloud Architect' section to emphasize..."
      </div>
    </div>
  </div>
);

const DiffDemoPanel: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ ...demoPanelBase, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Before → After</div>
    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)' }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>Worked on improving user experience for the product team.</span>
    </div>
    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)' }}>Led UX redesign reducing user drop-off by <strong style={{ color }}>34%</strong>, directly contributing to 2× increase in activation rate.</span>
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

const FeatureCard: React.FC<{ feature: typeof AI_FEATURES[0] }> = ({ feature }) => {
  const DemoPanel = DEMO_PANELS[feature.demo];
  return (
    <div
      style={{
        borderRadius: '16px', overflow: 'hidden',
        background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
        transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = feature.color + '45';
        e.currentTarget.style.background = feature.color + '08';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-ui-border)';
        e.currentTarget.style.background = 'var(--color-ui-surface)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Demo visual panel — always dark to simulate the app preview */}
      <div style={{ height: '130px', borderBottom: '1px solid var(--color-ui-border)', overflow: 'hidden' }}>
        <DemoPanel color={feature.color} />
      </div>
      {/* Text content */}
      <div style={{ padding: '20px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '22px' }}>{feature.icon}</span>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{feature.title}</h3>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.65 }}>{feature.desc}</p>
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
      padding: isMobile ? '60px 20px' : '100px 48px',
      background: 'var(--color-ui-bg)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
            marginBottom: '20px',
          }}>
            <Sparkles size={13} color="#C084FC" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#C084FC', letterSpacing: '0.04em' }}>AI-POWERED FEATURES</span>
          </div>
          <h2 style={{ fontSize: isMobile ? '28px' : 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
            Let AI do the heavy lifting
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'var(--color-ui-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
            Nine purpose-built AI tools to craft compelling, ATS-optimized resumes that make you stand out.
          </p>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? (isTablet ? 'repeat(2, 1fr)' : '1fr') : 'repeat(3, 1fr)', 
          gap: '20px' 
        }}>
          {AI_FEATURES.map((f, i) => <FeatureCard key={i} feature={f} />)}
        </div>
      </div>
    </section>
  );
};

export default AiFeaturesSection;
