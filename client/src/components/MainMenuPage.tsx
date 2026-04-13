import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  FileText, 
  CheckCircle, 
  Briefcase, 
  Mail, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import BreadcrumbNav from './BreadcrumbNav';
import ProfileModal from './ProfileModal';
import { useAuth } from '../contexts/AuthContext';

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = window.innerWidth < 1024;

  const options = [
    {
      id: 'builder',
      title: 'Resume Builder',
      description: 'Create, edit, and export professional resumes with AI assistance.',
      icon: <FileText size={24} />,
      color: '#6366F1',
      bg: 'rgba(99,102,241,0.1)',
      path: '/dashboard'
    },
    {
      id: 'ats',
      title: 'ATS Checker',
      description: 'Analyze your resume against job descriptions and improve your score.',
      icon: <CheckCircle size={24} />,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
      path: '/ats'
    },
    {
      id: 'tailor',
      title: 'Job Tailor',
      description: 'Automatically optimize your resume for a specific job posting.',
      icon: <Briefcase size={24} />,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
      path: '/tailor'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      description: 'Generate tailored cover letters that match your resume and the job.',
      icon: <Mail size={24} />,
      color: '#EC4899',
      bg: 'rgba(236,72,153,0.1)',
      path: '/cover-letter'
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      description: 'Get AI-generated interview questions based on your resume.',
      icon: <MessageSquare size={24} />,
      color: '#8B5CF6',
      bg: 'rgba(139,92,246,0.1)',
      path: '/interview-prep'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid var(--color-ui-border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-ui-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'var(--color-ui-border)' }} />
          <BreadcrumbNav view="hub" />
        </div>

        <UserAvatar onClick={() => setShowProfile(true)} showBadge={!isMobile} />
      </header>

      {showProfile && currentUser && (
        <ProfileModal 
          user={currentUser} 
          onClose={() => setShowProfile(false)} 
          onLogout={async () => { 
            setShowProfile(false); 
            navigate('/'); 
            await signOut(); 
          }} 
        />
      )}

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: isMobile ? '40px 20px' : '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: isMobile ? '28px' : '36px', 
            fontWeight: 800, 
            color: 'var(--color-ui-text)', 
            marginBottom: '12px', 
            letterSpacing: '-0.04em' 
          }}>
            What are we working on today?
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Choose a tool to get started with your career advancement.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px', 
          width: '100%' 
        }}>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.path)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '32px',
                background: hoveredId === option.id ? 'var(--color-ui-surface-2)' : 'var(--color-ui-surface)',
                border: `1.5px solid ${hoveredId === option.id ? option.color : 'var(--color-ui-border)'}`,
                borderRadius: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredId === option.id ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredId === option.id ? `0 20px 40px -12px ${option.color}20` : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '14px', 
                background: option.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: option.color, 
                marginBottom: '24px',
                transition: 'transform 0.2s'
              }}>
                {option.icon}
              </div>

              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: 'var(--color-ui-text)', 
                marginBottom: '10px', 
                letterSpacing: '-0.02em' 
              }}>
                {option.title}
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--color-ui-text-muted)', 
                lineHeight: 1.6,
                marginBottom: '20px'
              }}>
                {option.description}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13px', 
                fontWeight: 700, 
                color: option.color,
                marginTop: 'auto'
              }}>
                Launch Tool <ArrowRight size={14} style={{ transform: hoveredId === option.id ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer hint */}
      <footer style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid var(--color-ui-border)' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-ui-text-dim)' }}>
          © 2024 BespokeCV. All AI tools are included in your current plan.
        </p>
      </footer>
    </div>
  );
}
