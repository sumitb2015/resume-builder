import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Settings, LogOut, Shield, Zap, Crown, ArrowLeft, Loader2, Check, Sparkles, Layout } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { updateProfile } from 'firebase/auth';
import { templates } from '../templates';

interface Props {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

const PLAN_CONFIG = {
  free: { label: 'Free', color: '#94A3B8', icon: Shield, features: 'Basic sharing' },
  basic: { label: 'Basic', color: '#FCD34D', icon: Shield, features: 'Pro features unlocked' },
  pro: { label: 'Pro', color: '#818CF8', icon: Zap, features: 'All AI tools unlocked' },
  ultimate: { label: 'Ultimate', color: '#C084FC', icon: Crown, features: 'Full job tailoring' },
};

const AI_STYLES = [
  { id: 'professional', label: 'Professional & Balanced', desc: 'Standard business tone' },
  { id: 'concise', label: 'Action-Oriented & Concise', desc: 'Punchy, high-impact bullets' },
  { id: 'descriptive', label: 'Descriptive & Narrative', desc: 'Detailed storytelling' },
  { id: 'creative', label: 'Creative & Bold', desc: 'Stand out from the crowd' },
];

const ProfileModal: React.FC<Props> = ({ user, onClose, onLogout }) => {
  const { plan: currentPlan, expiresAt } = usePlan();
  const [view, setView] = useState<'main' | 'edit-profile' | 'preferences'>('main');
  
  // Edit Profile State
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preferences State
  const [defaultTemplate, setDefaultTemplate] = useState(localStorage.getItem('bespokecv_default_template') || 'classic');
  const [aiStyle, setAiStyle] = useState(localStorage.getItem('bespokecv_ai_style') || 'professional');

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Permanent';
    if (isNaN(date.getTime())) return 'Permanent';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsSavingProfile(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setSaveSuccess(true);
      // We don't need to manually refresh user since Firebase Auth handles it, 
      // but the UI might need a second to catch up in some setups.
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('bespokecv_default_template', defaultTemplate);
    localStorage.setItem('bespokecv_ai_style', aiStyle);
    setSaveSuccess(true);
    setTimeout(() => setView('main'), 1000);
  };

  const planKey = (currentPlan || 'free') as keyof typeof PLAN_CONFIG;
  const config = PLAN_CONFIG[planKey] || PLAN_CONFIG.free;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '450px', width: 'min(450px, 95%)', padding: '0', overflow: 'hidden', border: '1px solid var(--color-ui-border)' }}>
        
        {/* Header (Shared for all views) */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #6366F1, #A855F7)',
          color: 'white',
          position: 'relative'
        }}>
          {view !== 'main' && (
            <button 
              onClick={() => setView('main')}
              style={{
                position: 'absolute', top: '16px', left: '16px',
                background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 800
            }}>
              {(displayName || user.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {view === 'edit-profile' ? 'Edit Profile' : view === 'preferences' ? 'Preferences' : (displayName || 'Account Member')}
              </h2>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: '2px 0 0 0' }}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px' }}>
          
          {/* MAIN VIEW */}
          {view === 'main' && (
            <>
              <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-dim)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
                Subscription Status
              </h3>
              
              <div style={{ 
                background: 'var(--color-ui-surface-2)', borderRadius: '12px', padding: '16px',
                border: '1px solid var(--color-ui-border)', marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: `${config.color}20`, color: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <config.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{config.label} Plan</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>{config.features}</div>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: '11px', fontWeight: 800, border: '1px solid rgba(74,222,128,0.2)' }}>
                    ACTIVE
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--color-ui-border)', marginTop: '12px', marginBottom: '12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ui-text-muted)', fontSize: '13px' }}>
                  <Calendar size={14} style={{ opacity: 0.7 }} />
                  <span>Renewal Date: <strong>{formatDate(expiresAt)}</strong></span>
                </div>
              </div>

              <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-dim)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
                Account Settings
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => setView('edit-profile')} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', fontSize: '14px', borderRadius: '10px', color: 'var(--color-ui-text)', fontWeight: 500 }}>
                  <User size={18} style={{ opacity: 0.6 }} /> Edit Profile Details
                </button>
                <button onClick={() => setView('preferences')} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', fontSize: '14px', borderRadius: '10px', color: 'var(--color-ui-text)', fontWeight: 500 }}>
                  <Settings size={18} style={{ opacity: 0.6 }} /> App Preferences
                </button>
                <div style={{ height: '8px' }} />
                <button onClick={onLogout} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', fontSize: '14px', borderRadius: '10px', color: '#EF4444', fontWeight: 600, background: 'rgba(239, 68, 68, 0.05)' }}>
                  <LogOut size={18} /> Sign Out of Account
                </button>
              </div>
            </>
          )}

          {/* EDIT PROFILE VIEW */}
          {view === 'edit-profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="field-label">Display Name</label>
                <input 
                  className="field-input" 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  autoFocus
                />
              </div>

              <div style={{ 
                padding: '12px', borderRadius: '10px', background: 'var(--color-ui-surface-2)', 
                border: '1px solid var(--color-ui-border)', fontSize: '12px', color: 'var(--color-ui-text-muted)'
              }}>
                Changing your display name will update it across all your resumes and profile headers.
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSavingProfile || !displayName.trim()}
                style={{ width: '100%', justifyContent: 'center', height: '42px' }}
              >
                {isSavingProfile ? <Loader2 className="spin" size={18} /> : saveSuccess ? <><Check size={18} /> Saved!</> : 'Save Changes'}
              </button>
            </form>
          )}

          {/* PREFERENCES VIEW */}
          {view === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layout size={14} /> Default Template
                </label>
                <select 
                  className="field-input" 
                  value={defaultTemplate}
                  onChange={e => setDefaultTemplate(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> AI Writing Style
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AI_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setAiStyle(style.id)}
                      style={{
                        padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                        background: aiStyle === style.id ? 'rgba(99,102,241,0.1)' : 'var(--color-ui-surface-2)',
                        border: `1px solid ${aiStyle === style.id ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                        cursor: 'pointer', transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 600, color: aiStyle === style.id ? 'var(--color-ui-accent)' : 'var(--color-ui-text)' }}>{style.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginTop: '2px' }}>{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSavePreferences}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '42px', marginTop: '8px' }}
              >
                {saveSuccess ? <><Check size={18} /> Preferences Saved!</> : 'Save Preferences'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
