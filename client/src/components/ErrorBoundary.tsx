import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in component "${this.props.componentName || 'Unknown'}":`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const { componentName } = this.props;
      const { error } = this.state;

      return (
        <div style={{
          padding: '32px',
          borderRadius: '12px',
          background: 'rgba(248,81,73,0.05)',
          border: '1px solid rgba(248,81,73,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          margin: '20px'
        }}>
          <div style={{ color: 'var(--color-danger)' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
              Something went wrong{componentName ? ` in ${componentName}` : ''}
            </h3>
            {error?.message && (
              <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', maxWidth: '320px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px', marginTop: '6px', wordBreak: 'break-word' }}>
                {error.message}
              </p>
            )}
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', maxWidth: '280px', marginTop: '8px' }}>
              You can try recovering without losing your work, or reload the full page.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              style={{ gap: '8px', fontSize: '12px' }}
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              <RotateCcw size={13} />
              Try Again
            </button>
            <button
              className="btn-secondary"
              style={{ gap: '8px', fontSize: '12px' }}
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={13} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
