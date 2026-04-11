import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    initials: 'SC',
    avatarColor: '#6366F1',
    stars: 5,
    text: 'BespokeCV helped me land 3 interviews in my first week. The AI job tailor feature rewrote my bullets to perfectly match each JD. Got an offer from Google within 2 months.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Stripe',
    initials: 'MJ',
    avatarColor: '#10B981',
    stars: 5,
    text: 'My ATS score went from 62 to 94 after using the tailoring tool. Recruiters started calling back within days. The Pro plan paid for itself with my first interview.',
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist',
    company: 'Databricks',
    initials: 'PP',
    avatarColor: '#F59E0B',
    stars: 5,
    text: 'The bullet point writer captures your experience better than you write it yourself. Landed a senior role 40% above my previous salary. The skills finder alone is worth it.',
  },
  {
    name: "James O'Brien",
    role: 'UX Designer',
    company: 'Figma',
    initials: 'JO',
    avatarColor: '#EC4899',
    stars: 5,
    text: 'The Creative and Magazine templates are stunning. My resume finally looks as polished as my portfolio. Three callbacks in the first week after switching templates.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    company: 'HubSpot',
    initials: 'ER',
    avatarColor: '#A855F7',
    stars: 5,
    text: "The Executive template with the gold accent is exactly what a senior hire's resume should look like. The AI summary writer nailed my 15-year career story in 3 sentences.",
  },
  {
    name: 'David Kim',
    role: 'DevOps Engineer',
    company: 'Cloudflare',
    initials: 'DK',
    avatarColor: '#38BDF8',
    stars: 5,
    text: 'Developer template is perfect for technical roles. The ATS checker told me exactly which keywords I was missing. Went from zero callbacks to 5 interviews in two weeks.',
  },
];

const TestimonialCard: React.FC<{ t: typeof TESTIMONIALS[0] }> = ({ t }) => (
  <div
    style={{
      padding: '28px', borderRadius: '16px',
      background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
      transition: 'border-color 0.2s, transform 0.2s',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-ui-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    {/* Stars */}
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: t.stars }).map((_, i) => (
        <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />
      ))}
    </div>

    {/* Quote */}
    <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.75, flex: 1 }}>
      "{t.text}"
    </p>

    {/* Author */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: t.avatarColor + '30', border: `1.5px solid ${t.avatarColor}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: 700, color: t.avatarColor,
        flexShrink: 0,
      }}>
        {t.initials}
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '2px' }}>{t.name}</div>
        <div style={{ fontSize: '12.5px', color: 'var(--color-ui-text-dim)' }}>
          {t.role} · <span style={{ color: 'var(--color-ui-text-muted)' }}>{t.company}</span>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
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
    <section style={{
      padding: isMobile ? '60px 20px' : '100px 48px',
      background: 'var(--color-ui-surface-2)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
            Loved by job seekers worldwide
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'var(--color-ui-text-muted)' }}>
            Join 50,000+ professionals who've landed interviews with BespokeCV
          </p>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? (isTablet ? 'repeat(2, 1fr)' : '1fr') : 'repeat(3, 1fr)', 
          gap: '20px' 
        }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
