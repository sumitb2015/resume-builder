import React from 'react';
import { Shield, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePlan } from '../contexts/PlanContext';

const PLAN_BADGE_CONFIG = {
  free:    { label: 'Free',     color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: (size: number) => <Shield size={size} /> },
  basic:   { label: 'Basic',    color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: (size: number) => <Shield size={size} /> },
  pro:     { label: 'Pro',      color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: (size: number) => <Zap size={size} /> },
  ultimate:{ label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: (size: number) => <Crown size={size} /> },
} as const;

interface UserAvatarProps {
  onClick: () => void;
  showBadge?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ onClick, showBadge = true }) => {
  const { currentUser } = useAuth();
  const { plan } = usePlan();

  if (!currentUser) return null;

  const badge = plan ? PLAN_BADGE_CONFIG[plan] : null;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '4px', 
        borderRadius: '12px', 
        background: 'var(--color-ui-surface-2)', 
        border: '1px solid var(--color-ui-border)', 
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-ui-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {currentUser.photoURL ? (
        <img
          src={currentUser.photoURL}
          alt={currentUser.displayName ?? 'User'}
          style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}
        />
      ) : (
        <div style={{ 
          width: '28px', 
          height: '28px', 
          borderRadius: '8px', 
          background: 'linear-gradient(135deg, #6366F1, #A855F7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '12px', 
          fontWeight: 700, 
          color: 'white' 
        }}>
          {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
        </div>
      )}
      
      {showBadge && badge && (
        <div style={{
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '2px 8px', 
          borderRadius: '6px',
          background: badge.bg, 
          border: `1px solid ${badge.color}30`,
        }}>
          <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon(10)}</span>
          <span style={{ fontSize: '10px', fontWeight: 800, color: badge.color, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{badge.label}</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
