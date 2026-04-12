import React, { useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import {
  Zap, FileText, Award, FolderOpen, Lock, MessageSquare, Sun, Moon, LogOut, Menu, ArrowLeft, Palette, HelpCircle, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { usePlan } from '../contexts/PlanContext';
import { useTheme } from '../contexts/ThemeContext';
import { useResume } from '../contexts/ResumeContext';
import { useSavedResumes } from '../hooks/useSavedResumes';
import { useIsMobile } from '../hooks/useIsMobile';
import BreadcrumbNav from './BreadcrumbNav';
import UserAvatar from './UserAvatar';
import ProfileModal from './ProfileModal';
import ExpertReviewModal from './ExpertReviewModal';
import SavedResumesPanel from './SavedResumesPanel';
import UpgradeModal from './UpgradeModal';
import type { Plan, Feature } from '../shared/constants';
import { FEATURE_REQUIRED_PLAN, FEATURE_LABELS } from '../shared/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
  setShowRightPanel?: (show: boolean) => void;
}

// Plan badge config
const PLAN_BADGE: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  free: { label: 'Free', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: <Lock size={11} /> },
  basic: { label: 'Basic', color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: <Lock size={11} /> },
  pro: { label: 'Pro', color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: <Zap size={11} /> },
  ultimate: { label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: <Award size={11} /> },
};

function PlanBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { plan } = usePlan();
  if (!plan) return null;
  const badge = PLAN_BADGE[plan];
  if (!badge) return null;
  const isSmall = size === 'sm';
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: isSmall ? '3px 8px' : '4px 10px',
          borderRadius: '100px',
          background: badge.bg,
          border: `1px solid ${badge.color}40`,
          userSelect: 'none',
        }}
      >
        <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon}</span>
        <span style={{ fontSize: isSmall ? '10px' : '11px', fontWeight: 700, color: badge.color, letterSpacing: '0.03em' }}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, rightPanel, showRightPanel, setShowRightPanel }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  const { canAccess, maxResumes } = usePlan();
  const { theme, toggleTheme } = useTheme();
  const { resume, activeTemplate, setActiveTemplate, currentResumeId, setCurrentResumeId, handleNewResume, loadResume, clearDraft } = useResume();
  const { savedResumes, saveResume, renameResume, deleteResume } = useSavedResumes();

  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showExpertReview, setShowExpertReview] = useState(false);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState<{ requiredPlan: Plan; featureLabel: string } | null>(null);

  const handleSave = () => {
    const savedId = saveResume(
      resume.personal.name || 'Untitled Resume',
      resume,
      activeTemplate,
      currentResumeId ?? undefined
    );
    if (savedId) {
      setCurrentResumeId(savedId);
      clearDraft();
      toast.success('Resume saved.');
    } else {
      toast.error('Save failed — upgrade your plan to save more resumes.');
    }
  };

  const path = location.pathname;
  const view = path === '/builder' ? 'builder' : 
               path === '/ats' ? 'ats-checker' :
               path === '/tailor' ? 'job-tailor' :
               path === '/cover-letter' ? 'cover-letter' :
               path === '/interview-prep' ? 'interview-prep' :
               path === '/preview' ? 'preview' : 'builder';

  const atsLocked = !canAccess('dynamic-ats');
  const tailorLocked = !canAccess('job-tailor');
  const coverLetterLocked = !canAccess('cover-letter');
  const interviewLocked = !canAccess('interview-prep');
  const expertLocked = !canAccess('expert-review');

  const showUpgrade = (feature: Feature) => {
    setUpgradePrompt({
      requiredPlan: FEATURE_REQUIRED_PLAN[feature],
      featureLabel: FEATURE_LABELS[feature],
    });
  };

  const handleLogout = async () => {
    setShowProfile(false);
    navigate('/');
    await signOut();
  };

  const sidebar = (
    <aside className={`app-sidebar no-print ${showMobileSidebar ? 'show-mobile' : ''}`} style={isMobile ? { position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px', zIndex: 1100 } : { zIndex: 1100 }}>
      <div className="sidebar-logo" onClick={() => { navigate('/'); setShowMobileSidebar(false); }} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-icon">
          <Zap size={18} color="white" fill="white" />
        </div>
        <span className="sidebar-logo-text" style={isMobile ? { opacity: 1 } : {}}>Bespoke<span style={{ color: '#818CF8' }}>CV</span></span>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        {[
          { id: 'builder', path: '/builder', label: 'Resume Builder', Icon: FileText, locked: false, plan: '' },
          ...(isMobile ? [{ id: 'my-resumes', path: '', label: 'My Resumes', Icon: FolderOpen, locked: false, plan: '' }] : []),
          { id: 'ats-checker', path: '/ats', label: 'ATS Checker', Icon: Award, locked: atsLocked, plan: 'Pro' },
          { id: 'job-tailor', path: '/tailor', label: 'Job Tailor', Icon: Zap, locked: tailorLocked, plan: 'Ultimate' },
          { id: 'cover-letter', path: '/cover-letter', label: 'Cover Letter', Icon: FileText, locked: coverLetterLocked, plan: 'Pro' },
          { id: 'interview-prep', path: '/interview-prep', label: 'Interview Prep', Icon: HelpCircle, locked: interviewLocked, plan: 'Ultimate' },
        ].map(tab => {
          const isActive = path === tab.path;
          return (
            <button
              key={tab.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={tab.locked ? `Requires ${tab.plan} plan` : tab.label}
              style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
              onClick={() => {
                setShowMobileSidebar(false);
                if (tab.id === 'my-resumes') { setShowSavedPanel(true); return; }
                
                if (tab.locked) {
                  const feature = tab.id === 'ats-checker' ? 'dynamic-ats' : 
                                  tab.id === 'job-tailor' ? 'job-tailor' :
                                  tab.id === 'cover-letter' ? 'cover-letter' :
                                  tab.id === 'interview-prep' ? 'interview-prep' : 'builder' as Feature;
                  showUpgrade(feature);
                  return;
                }
                navigate(tab.path);
              }}
            >
              <div className="sidebar-icon">
                {/* @ts-ignore */}
                <tab.Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.locked && <Lock size={10} style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--color-ui-surface)', borderRadius: '50%', padding: '1px' }} />}
              </div>
              <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', paddingBottom: '10px' }}>
        <button 
          className="sidebar-item" 
          style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
          onClick={() => { setShowMobileSidebar(false); if (expertLocked) showUpgrade('expert-review' as any); else setShowExpertReview(true); }}
          title="Expert Review"
        >
          <div className="sidebar-icon"><MessageSquare size={20} /></div>
          <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>Expert Review</span>
        </button>
        <button 
          className="sidebar-item" 
          style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          <div className="sidebar-icon">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</div>
          <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div style={{ height: '1px', width: '40%', background: 'var(--color-ui-border)', marginTop: '8px', marginBottom: '8px' }} />
        <button 
          className="sidebar-item" 
          style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
          onClick={handleLogout} 
          title="Sign Out"
        >
          <div className="sidebar-icon"><LogOut size={20} /></div>
          <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  const topBar = (
    <header className="top-bar no-print" style={{ 
      borderBottom: '1px solid var(--color-ui-border)', 
      background: 'var(--color-ui-bg)',
      height: isMobile ? '52px' : '56px',
      padding: isMobile ? '0 12px' : '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
        {isMobile && (
          <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setShowMobileSidebar(true)}>
            <Menu size={20} />
          </button>
        )}
        <BreadcrumbNav view={view as any} />
        {!isMobile && (
          <>
            <div style={{ width: '1px', height: '16px', background: 'var(--color-ui-border)' }} />
            <PlanBadge size="sm" />
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        {path === '/preview' && (
          <button 
            className="btn-secondary" 
            style={{ gap: '4px', fontSize: isMobile ? '12px' : '13px', padding: isMobile ? '5px 10px' : '8px 16px' }} 
            onClick={() => navigate('/builder')}
          >
            <ArrowLeft size={14} />
            {isMobile ? 'Edit' : 'Back to Editor'}
          </button>
        )}

        {path === '/builder' && (
          <>
            <button className={showRightPanel ? 'btn-primary' : 'btn-secondary'} style={{ gap: '6px', fontSize: '12.5px', padding: isMobile ? '6px' : '7px 14px' }} onClick={() => setShowRightPanel?.(!showRightPanel)}>
              <Palette size={isMobile ? 18 : 14} /> 
              {isMobile ? '' : 'Style'}
            </button>

            <button className="btn-secondary" style={{ gap: '6px', fontSize: isMobile ? '12px' : '12.5px', padding: isMobile ? '6px 10px' : '7px 14px' }} onClick={handleSave}>
              <Save size={isMobile ? 14 : 13} />
              {isMobile ? '' : 'Save'}
            </button>

            {!isMobile && (
              <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }} onClick={() => setShowSavedPanel(true)}>
                <FolderOpen size={14} />
                My Resumes
                {savedResumes.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ui-accent)', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{savedResumes.length}</span>}
              </button>
            )}

            <button className="btn-primary" style={{ gap: '6px', fontSize: isMobile ? '12px' : '13px', padding: isMobile ? '6px 12px' : '8px 18px' }} onClick={() => {
              setActiveTemplate((t: any) => ({ ...t, settings: t.settings ?? { margin: 15, fontSize: 100, lineHeight: 1.5 } }));
              navigate('/preview');
            }}>
              <FileText size={isMobile ? 14 : 15} /> 
              {isMobile ? 'Preview' : 'Preview & Export'}
            </button>
          </>
        )}

        <UserAvatar onClick={() => setShowProfile(true)} showBadge={!isMobile} />
      </div>
    </header>
  );

  return (
    <div className="app-layout-root" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
      {sidebar}
      <div className="app-main-content">
        {topBar}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: isMobile ? 'visible' : 'hidden', height: isMobile ? '100%' : '100%' }}>
          {children}
          {(!isMobile || showRightPanel) && rightPanel && (
             <div style={{ 
               width: showRightPanel ? (isMobile ? '100%' : '320px') : '0', 
               flexShrink: 0, 
               overflow: 'hidden', 
               transition: 'width 0.25s',
               ...(isMobile ? { position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1150, background: 'var(--color-ui-bg)' } : {})
             }} className="no-print">
               {rightPanel}
             </div>
          )}
        </div>
      </div>

      {showMobileSidebar && isMobile && (
        <div 
          className="modal-overlay no-print" 
          style={{ zIndex: 1050, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} 
          onClick={() => setShowMobileSidebar(false)} 
        />
      )}

      {showSavedPanel && (
        <SavedResumesPanel 
          savedResumes={savedResumes} 
          currentResumeId={currentResumeId} 
          maxResumes={maxResumes} 
          onLoad={(saved) => { loadResume(saved); setShowSavedPanel(false); }} 
          onDelete={deleteResume} 
          onRename={renameResume} 
          onNewResume={() => { handleNewResume(); setShowSavedPanel(false); }} 
          onClose={() => setShowSavedPanel(false)} 
          onUpgradeNeeded={() => showUpgrade('resume-limit' as any)} 
        />
      )}

      {showProfile && <ProfileModal user={currentUser} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}
      
      {showExpertReview && (
        <ExpertReviewModal 
          userId={currentUser?.uid || ''} 
          resumeId={currentResumeId} 
          resumeData={resume} 
          onClose={() => setShowExpertReview(false)} 
        />
      )}

      {upgradePrompt && (
        <UpgradeModal 
          requiredPlan={upgradePrompt.requiredPlan as any} 
          featureLabel={upgradePrompt.featureLabel} 
          onClose={() => setUpgradePrompt(null)} 
          onUpgrade={(p) => { navigate('/checkout', { state: { plan: p, annual: false } }); setUpgradePrompt(null); }} 
        />
      )}
    </div>
  );
}
