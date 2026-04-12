import { useState } from 'react';
import { Zap, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BreadcrumbNav from './BreadcrumbNav';

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

type Mode = 'signin' | 'signup' | 'reset' | 'reset-sent';
type FieldErrors = { name?: string; email?: string; password?: string; general?: string };

function firebaseErrorToField(code: string): { field: keyof FieldErrors; msg: string } {
  switch (code) {
    case 'auth/email-already-in-use':
      return { field: 'email', msg: 'An account with this email already exists.' };
    case 'auth/invalid-email':
      return { field: 'email', msg: 'Please enter a valid email address.' };
    case 'auth/weak-password':
      return { field: 'password', msg: 'Password must be at least 6 characters.' };
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
      return { field: 'email', msg: 'No account found with this email.' };
    case 'auth/wrong-password':
      return { field: 'password', msg: 'Incorrect password. Please try again.' };
    case 'auth/too-many-requests':
      return { field: 'general', msg: 'Too many attempts. Please try again later.' };
    default:
      return { field: 'general', msg: 'Something went wrong. Please try again.' };
  }
}

export default function LoginPage({ onLoginSuccess }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setName('');
    setPassword('');
    setFieldErrors({});
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setFieldErrors({ email: 'Please enter a valid email address.' });
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setMode('reset-sent');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found') {
        setFieldErrors({ email: 'No account found with this email.' });
      } else {
        setFieldErrors({ general: 'Failed to send reset email. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Client-side validation before hitting Firebase
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (mode === 'signup' && !name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    return errors;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(name.trim(), email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      onLoginSuccess();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      const { field, msg } = firebaseErrorToField(code);
      setFieldErrors({ [field]: msg });
      setLoading(false);
    }
  };

  // Unchanged Google flow
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setFieldErrors({});
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (!message.includes('popup-closed')) {
        setFieldErrors({ general: 'Google sign-in failed. Please try again.' });
      }
      setGoogleLoading(false);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    borderColor: hasError ? 'var(--color-danger)' : undefined,
    boxShadow: hasError ? '0 0 0 3px rgba(248,81,73,0.15)' : undefined,
  });

  const tabBtn = (label: string, value: Mode) => (
    <button
      type="button"
      onClick={() => switchMode(value)}
      style={{
        flex: 1,
        padding: '8px 0',
        borderRadius: '8px',
        border: `1.5px solid ${mode === value ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
        background: mode === value ? 'rgba(99,102,241,0.12)' : 'transparent',
        color: mode === value ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-ui-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <BreadcrumbNav view="login" />
      </div>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--color-ui-surface)',
        border: '1px solid var(--color-ui-border)',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
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

        {/* Dynamic title */}
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px', textAlign: 'center' }}>
          {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Check your email'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
          {mode === 'signin' ? 'Sign in to continue building your resume'
            : mode === 'signup' ? 'Start building your perfect resume with AI'
            : mode === 'reset' ? 'Enter your email and we\'ll send a reset link'
            : `A password reset link has been sent to ${email}`}
        </p>

        {/* Tab toggle — hidden for reset flows */}
        {(mode === 'signin' || mode === 'signup') && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {tabBtn('Sign In', 'signin')}
            {tabBtn('Create Account', 'signup')}
          </div>
        )}

        {/* ── Password reset sent ── */}
        {mode === 'reset-sent' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '8px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={26} style={{ color: '#818CF8' }} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: '280px' }}>
              If an account exists for that email, you'll receive a reset link shortly. Check your spam folder if it doesn't arrive.
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ gap: '8px', fontSize: '13px', width: '100%', justifyContent: 'center' }}
              onClick={() => switchMode('signin')}
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </div>
        )}

        {/* ── Password reset form ── */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="field-label">Email address</label>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                autoFocus
                style={inputStyle(!!fieldErrors.email)}
              />
              {fieldErrors.email && <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '5px' }}>{fieldErrors.email}</p>}
            </div>
            {fieldErrors.general && (
              <p style={{ fontSize: '12px', color: 'var(--color-danger)', textAlign: 'center' }}>{fieldErrors.general}</p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <><Loader2 size={14} className="spin" /> Sending…</> : 'Send Reset Link →'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ gap: '6px', fontSize: '13px', justifyContent: 'center' }}
              onClick={() => switchMode('signin')}
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </form>
        )}

        {/* Email / password form */}
        {(mode === 'signin' || mode === 'signup') && <form onSubmit={handleEmailSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label className="field-label">Full Name</label>
              <input
                className="field-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                style={inputStyle(!!fieldErrors.name)}
              />
              {fieldErrors.name && <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '5px' }}>{fieldErrors.name}</p>}
            </div>
          )}

          <div>
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete={mode === 'signup' ? 'email' : 'username'}
              style={inputStyle(!!fieldErrors.email)}
            />
            {fieldErrors.email && <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '5px' }}>{fieldErrors.email}</p>}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label className="field-label" style={{ margin: 0 }}>Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  style={{ fontSize: '12px', color: 'var(--color-ui-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)' }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              style={inputStyle(!!fieldErrors.password)}
            />
            {fieldErrors.password && <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '5px' }}>{fieldErrors.password}</p>}
          </div>

          {fieldErrors.general && (
            <p style={{ fontSize: '12px', color: 'var(--color-danger)', textAlign: 'center' }}>{fieldErrors.general}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '14px', marginTop: '2px', opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? <><Loader2 size={14} className="spin" /> {mode === 'signup' ? 'Creating account…' : 'Signing in…'}</>
              : mode === 'signup' ? 'Create Account →' : 'Sign In →'
            }
          </button>
        </form>}

        {/* Divider + Google — only for signin/signup */}
        {(mode === 'signin' || mode === 'signup') && <>
        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-ui-border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-ui-border)' }} />
        </div>

        {/* Google sign-in — unchanged */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '13px 20px',
            borderRadius: '10px',
            border: '1px solid var(--color-ui-border)',
            background: googleLoading ? 'var(--color-ui-bg)' : 'var(--color-ui-surface-2, #1C2128)',
            color: 'var(--color-ui-text)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: googleLoading ? 0.7 : 1,
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-ui-border)'; }}
        >
          {googleLoading ? (
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--color-ui-border)', borderTopColor: '#6366F1', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p style={{ marginTop: '20px', fontSize: '11.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
          By continuing, you agree to our Terms of Service.<br />
          Your data stays private and is never sold.
        </p>
        </>}
      </div>
    </div>
  );
}
