import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onLoginSuccess: () => void;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage({ onLoginSuccess }: Props) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      // User closed the popup — not really an error worth showing
      if (!message.includes('popup-closed')) {
        setError('Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-ui-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--color-ui-surface)',
        border: '1px solid var(--color-ui-border)',
        borderRadius: '20px',
        padding: '48px 40px',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6366F1, #A855F7)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
            Bespoke<span style={{ color: '#818CF8' }}>CV</span>
          </span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', marginBottom: '36px', lineHeight: 1.6 }}>
          Sign in to build your perfect resume with AI
        </p>

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '13px 20px',
            borderRadius: '10px',
            border: '1px solid var(--color-ui-border)',
            background: loading ? 'var(--color-ui-bg)' : 'var(--color-ui-surface-2, #1C2128)',
            color: 'var(--color-ui-text)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-ui-border)'; }}
        >
          {loading ? (
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              border: '2px solid var(--color-ui-border)',
              borderTopColor: '#6366F1',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-danger)', lineHeight: 1.5 }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: '28px', fontSize: '12px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>
          By continuing, you agree to our Terms of Service.<br />
          Your data stays private and is never sold.
        </p>
      </div>
    </div>
  );
}
