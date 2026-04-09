import React, { useEffect, useState } from 'react';
import { X, User, Mail, CreditCard, Calendar, Settings, LogOut, Shield, Zap, Crown } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

const PLAN_CONFIG = {
  basic: { label: 'Basic', color: '#FCD34D', icon: Shield },
  pro: { label: 'Pro', color: '#818CF8', icon: Zap },
  ultimate: { label: 'Ultimate', color: '#C084FC', icon: Crown },
};

const ProfileModal: React.FC<Props> = ({ user, onClose, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  useEffect(() => {
    api.getUserProfile(user.uid)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
        setLoading(false);
      });
  }, [user.uid]);

  const formatDate = (dateObj: any) => {
    if (!dateObj) {
      // Fallback: If no expiration is set, assume 30 days from creation or now
      return 'Ongoing';
    }
    
    let date: Date;
    if (dateObj._seconds) {
      date = new Date(dateObj._seconds * 1000);
    } else if (dateObj.seconds) {
      date = new Date(dateObj.seconds * 1000);
    } else {
      date = new Date(dateObj);
    }

    if (isNaN(date.getTime())) return 'Managed';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditProfile = () => {
    alert('Profile editing coming soon! This will allow you to update your display name and contact info.');
  };

  const handlePreferences = () => {
    alert('Preferences coming soon! You will be able to set default templates and AI writing styles.');
  };

  const plan = (profile?.plan || 'basic') as keyof typeof PLAN_CONFIG;
  const config = PLAN_CONFIG[plan];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '450px', padding: '0', overflow: 'hidden', border: '1px solid var(--color-ui-border)' }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #6366F1, #A855F7)',
          color: 'white',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
          >
            <X size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', border: '4px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{user.displayName || 'Account Member'}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' }}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-dim)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
            Subscription Status
          </h3>
          
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="spin" style={{ width: '24px', height: '24px', border: '2px solid var(--color-ui-border)', borderTopColor: '#6366F1', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : (
            <div style={{ 
              background: 'var(--color-ui-surface-2)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid var(--color-ui-border)',
              marginBottom: '24px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: `${config.color}20`,
                    color: config.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <config.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{config.label} Plan</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>Pro features unlocked</div>
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '100px', 
                  background: 'rgba(74,222,128,0.15)', 
                  color: '#4ADE80',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: '1px solid rgba(74,222,128,0.2)'
                }}>
                  ACTIVE
                </div>
              </div>
              
              <div style={{ height: '1px', background: 'var(--color-ui-border)', margin: '12px 0' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ui-text-muted)', fontSize: '13px' }}>
                <Calendar size={14} style={{ opacity: 0.7 }} />
                <span>Renewal Date: <strong>{formatDate(profile?.expiresAt)}</strong></span>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-dim)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
            Account Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={handleEditProfile}
              className="btn-ghost" 
              style={{ 
                justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', 
                fontSize: '14px', borderRadius: '10px', color: 'var(--color-ui-text)',
                fontWeight: 500
              }}
            >
              <User size={18} style={{ opacity: 0.6 }} /> Edit Profile Details
            </button>
            <button 
              onClick={handlePreferences}
              className="btn-ghost" 
              style={{ 
                justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', 
                fontSize: '14px', borderRadius: '10px', color: 'var(--color-ui-text)',
                fontWeight: 500
              }}
            >
              <Settings size={18} style={{ opacity: 0.6 }} /> App Preferences
            </button>
            <div style={{ height: '8px' }} />
            <button 
              onClick={onLogout}
              className="btn-ghost" 
              style={{ 
                justifyContent: 'flex-start', padding: '12px', gap: '12px', width: '100%', 
                fontSize: '14px', borderRadius: '10px', color: '#EF4444',
                fontWeight: 600, background: 'rgba(239, 68, 68, 0.05)'
              }}
            >
              <LogOut size={18} /> Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
