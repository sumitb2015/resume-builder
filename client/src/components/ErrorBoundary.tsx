import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
              Something went wrong
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', maxWidth: '280px' }}>
              We encountered an error while rendering this {this.props.componentName || 'component'}.
            </p>
          </div>
          <button 
            className="btn-secondary" 
            style={{ gap: '8px', fontSize: '12px' }}
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={14} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
