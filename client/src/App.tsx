import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';

// Layout & UI
import DashboardLayout from './components/DashboardLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Standalone Pages
import LandingPage from './components/LandingPage';
const LoginPage = lazy(() => import('./components/LoginPage'));
const MainMenuPage = lazy(() => import('./components/MainMenuPage'));
const BlogPage = lazy(() => import('./components/landing/BlogPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));

// Tool Pages
import ResumeBuilder from './components/ResumeBuilder';
const AtsCheckerPage = lazy(() => import('./components/AtsCheckerPage'));
const JobTailorPage = lazy(() => import('./components/JobTailorPage'));
const CoverLetterPage = lazy(() => import('./components/CoverLetterPage'));
const InterviewPrepPage = lazy(() => import('./components/InterviewPrepPage'));
const ExportPreview = lazy(() => import('./components/ExportPreview'));
const AiWriterFlow = lazy(() => import('./components/AiWriterFlow'));
const ModeSelectModal = lazy(() => import('./components/ModeSelectModal'));

// Templates & Types
import { templates } from './templates';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider, usePlan } from './contexts/PlanContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ResumeProvider, useResume } from './contexts/ResumeContext';
import StylePanel from './components/StylePanel';
import PagedPreview from './components/PagedPreview';

// Icons & UI
import { 
  Zap, Check
} from 'lucide-react';
import BreadcrumbNav from './components/BreadcrumbNav';
import UserAvatar from './components/UserAvatar';

// ── PRINT PORTAL ──────────────────────────────────────────
const PrintPortal = () => {
  const { resume, activeTemplate } = useResume();
  const [pageCount, setPageCount] = useState(1);
  const portalNode = document.getElementById('print-portal');
  if (!portalNode) return null;

  return createPortal(
    <div className="print-mode">
      <PagedPreview resume={resume} config={activeTemplate} forcePageCount={pageCount} onPageCount={setPageCount} />
    </div>,
    portalNode
  );
};

// ── PROTECTED ROUTE ───────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}

// ── BUILDER PAGE ──────────────────────────────────────────
function BuilderPage() {
  const { resume, activeTemplate, setActiveTemplate } = useResume();
  const [showRightPanel, setShowRightPanel] = useState(window.innerWidth >= 1024);
  const [zoom, setZoom] = useState(window.innerWidth < 1024 ? 0.4 : 0.75);
  const [, setPageCount] = useState(1);

  return (
    <DashboardLayout 
      showRightPanel={showRightPanel} 
      setShowRightPanel={setShowRightPanel}
      rightPanel={
        <StylePanel 
          templates={templates} 
          activeTemplate={activeTemplate} 
          onTemplateChange={setActiveTemplate} 
          onColorChange={(palette) => setActiveTemplate(prev => ({ ...prev, colors: { ...prev.colors, primary: palette.primary, accent: palette.accent } }))} 
          onClose={() => setShowRightPanel(false)} 
          zoom={zoom} 
          onZoomChange={setZoom} 
          onUpgradeNeeded={() => {}} 
        />
      }
    >
      <div style={{ width: window.innerWidth >= 1024 ? '40%' : '100%', minWidth: window.innerWidth >= 1024 ? '450px' : 'auto', flexShrink: 0, transition: 'width 0.25s', position: 'relative', height: window.innerWidth < 1024 ? 'auto' : '100%', overflow: window.innerWidth < 1024 ? 'visible' : 'hidden' }} className="no-print">
        <ErrorBoundary componentName="ResumeBuilder">
          <ResumeBuilder 
            onUpgradeNeeded={() => {}} 
          />
        </ErrorBoundary>
      </div>

      {window.innerWidth >= 1024 && (
        <main className="preview-viewport" style={{ flex: 1, minWidth: 0, padding: '32px 24px 64px' }}>
          <div className="preview-scaler" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            <ErrorBoundary componentName="PagedPreview">
              <PagedPreview resume={resume} config={activeTemplate} onPageCount={setPageCount} />
            </ErrorBoundary>
          </div>
        </main>
      )}
    </DashboardLayout>
  );
}

// ── WRAPPERS TO BRIDGE OLD PROPS ──────────────────────────

function LandingPageWrapper() {
  const navigate = useNavigate();
  return (
    <LandingPage 
      onStart={() => navigate('/hub')} 
      onOpenBlog={() => navigate('/blog')} 
      onCheckout={(p, a) => navigate('/checkout', { state: { plan: p, annual: a } })}
      onShowProfile={() => {}}
    />
  );
}

function BlogPageWrapper() {
  const navigate = useNavigate();
  return <BlogPage onBack={() => navigate('/')} onStart={() => navigate('/hub')} onShowProfile={() => {}} />;
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/hub', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return <LoginPage onLoginSuccess={() => {}} />;
}

function CheckoutPageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  return (
    <CheckoutPage
      planTier={state?.plan || 'pro'}
      isAnnual={state?.annual || false}
      onBack={() => navigate('/plans')}
      onSuccess={() => navigate('/hub')}
      onShowProfile={() => {}}
    />
  );
}

function ModeSelectPageWrapper() {
  const navigate = useNavigate();
  const { setResume, setImprovements } = useResume();
  return (
    <ModeSelectModal 
      onSelect={(mode, res, imp) => {
        if (mode === 'ai-writer') { navigate('/ai-writer'); return; }
        if (res) setResume(res);
        if (imp) setImprovements(imp);
        navigate('/builder');
      }} 
      onBack={() => navigate('/')} 
      onUpgradeNeeded={() => {}} 
      onShowProfile={() => {}}
    />
  );
}

function AiWriterPageWrapper() {
  const navigate = useNavigate();
  const { setResume, setActiveTemplate } = useResume();
  return (
    <AiWriterFlow 
      onComplete={(res, tpl) => {
        setResume(res);
        setActiveTemplate(tpl);
        navigate('/builder');
      }}
      onBack={() => navigate('/dashboard')} 
      onShowProfile={() => {}}
    />
  );
}

function ExportPreviewWrapper() {
  const { resume, setResume, activeTemplate, setActiveTemplate } = useResume();
  return <ExportPreview resume={resume} config={activeTemplate} onUpdateConfig={setActiveTemplate} onUpdateResume={setResume} pageCount={1} onPageCount={() => {}} />;
}

function AtsCheckerWrapper() {
  const { resume } = useResume();
  const navigate = useNavigate();
  return <AtsCheckerPage resume={resume} onBack={() => navigate('/builder')} onUpgradeNeeded={() => {}} />;
}

function JobTailorWrapper() {
  const { resume, setResume } = useResume();
  const navigate = useNavigate();
  return <JobTailorPage resume={resume} onApplyChanges={(upd) => { setResume(upd); navigate('/builder'); }} onBack={() => navigate('/builder')} onUpgradeNeeded={() => {}} />;
}

function CoverLetterWrapper() {
  const { resume } = useResume();
  const navigate = useNavigate();
  return <CoverLetterPage resume={resume} onBack={() => navigate('/builder')} onUpgradeNeeded={() => {}} />;
}

function InterviewPrepWrapper() {
  const { resume } = useResume();
  const navigate = useNavigate();
  return <InterviewPrepPage resume={resume} onBack={() => navigate('/builder')} onUpgradeNeeded={() => {}} />;
}

// ── PLAN SELECT PAGE ──────────────────────────────────────
const PLAN_OPTIONS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '₹0',
    period: 'forever',
    tagline: 'Get started for free',
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #94A3B8, #64748B)',
    features: ['1 basic template', 'Live preview & editor', 'Resume sharing', 'Basic analytics'],
  },
  {
    id: 'basic' as const,
    name: 'Basic',
    price: '₹199',
    period: '14 days',
    tagline: 'Try the essentials',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    features: ['3 professional templates', 'Live preview & editor', 'PDF export (1/day)', 'ATS score (template)', 'AI bullets (3/day)'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '₹499',
    period: 'mo',
    tagline: 'Core AI writing tools',
    color: '#818CF8',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    features: [`All templates`, 'Dynamic ATS + JD matching', 'Unlimited AI bullets', 'AI summary writer', 'Skills finder', 'Color customization'],
  },
  {
    id: 'ultimate' as const,
    name: 'Ultimate',
    price: '₹699',
    period: 'mo',
    tagline: 'Pro + advanced AI workflows',
    color: '#C084FC',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
    features: ['Everything in Pro', 'Job tailoring (full rewrite)', 'Resume import PDF/DOCX', 'LinkedIn profile import', 'Diff review before/after', 'Priority PDF generation'],
  },
];

export function PlanSelectPage() {
  const { setPlan } = usePlan();
  const navigate = useNavigate();
  const [isMobile] = useState(window.innerWidth < 1024);

  const handleSelect = (planId: 'free' | 'basic' | 'pro' | 'ultimate') => {
    if (planId === 'free') {
      setPlan('free');
      navigate('/hub');
    } else {
      navigate('/checkout', { state: { plan: planId, annual: false } });
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-ui-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '80px 20px 40px' : '40px 24px',
    }}>
      <div style={{ position: 'fixed', top: isMobile ? '16px' : '24px', left: isMobile ? '16px' : '24px', zIndex: 100 }}>
        <BreadcrumbNav view="plan-select" />
      </div>

      <div style={{ position: 'fixed', top: isMobile ? '16px' : '20px', right: isMobile ? '16px' : '24px', zIndex: 100 }}>
        <UserAvatar onClick={() => {}} showBadge={!isMobile} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '32px' : '48px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--color-ui-text)' }}>
          Bespoke<span style={{ color: '#818CF8' }}>CV</span>
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '40px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '10px' }}>
          Choose your plan
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
          Select a plan to get started. You can upgrade anytime.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
        gap: '16px', 
        maxWidth: '1100px', 
        width: '100%' 
      }}>
        {PLAN_OPTIONS.map((plan, i) => (
          <div
            key={plan.id}
            style={{
              borderRadius: '16px', padding: '28px 24px',
              border: i === 2 ? `1px solid ${plan.color}50` : '1px solid var(--color-ui-border)',
              background: i === 2 ? `linear-gradient(135deg, ${plan.color}12, ${plan.color}06)` : 'var(--color-ui-surface)',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}
          >
            {i === 2 && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                padding: '4px 14px', borderRadius: '100px',
                background: plan.gradient,
                fontSize: '10.5px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap',
              }}>
                Most Popular
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginBottom: '16px' }}>{plan.tagline}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>₹</span>
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em' }}>
                  {plan.price.replace('₹', '')}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>/{plan.period}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '24px' }}>
              {plan.features.map((f, fi) => (
                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={13} color={plan.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelect(plan.id)}
              style={{
                width: '100%', padding: '11px', borderRadius: '9px',
                background: i === 2 ? plan.gradient : 'transparent',
                border: i === 2 ? 'none' : `1px solid ${plan.color}50`,
                color: i === 2 ? 'white' : plan.color,
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              Start with {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/blog" element={<BlogPageWrapper />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        
        <Route path="/plans" element={<ProtectedRoute><PlanSelectPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPageWrapper /></ProtectedRoute>} />
        <Route path="/hub" element={<ProtectedRoute><MainMenuPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><ModeSelectPageWrapper /></ProtectedRoute>} />
        <Route path="/ai-writer" element={<ProtectedRoute><AiWriterPageWrapper /></ProtectedRoute>} />
        
        <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><DashboardLayout><ExportPreviewWrapper /></DashboardLayout></ProtectedRoute>} />
        <Route path="/ats" element={<ProtectedRoute><DashboardLayout><AtsCheckerWrapper /></DashboardLayout></ProtectedRoute>} />
        <Route path="/tailor" element={<ProtectedRoute><DashboardLayout><JobTailorWrapper /></DashboardLayout></ProtectedRoute>} />
        <Route path="/cover-letter" element={<ProtectedRoute><DashboardLayout><CoverLetterWrapper /></DashboardLayout></ProtectedRoute>} />
        <Route path="/interview-prep" element={<ProtectedRoute><DashboardLayout><InterviewPrepWrapper /></DashboardLayout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PrintPortal />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PlanProvider>
            <ResumeProvider>
              <AppRoutes />
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </ResumeProvider>
          </PlanProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
