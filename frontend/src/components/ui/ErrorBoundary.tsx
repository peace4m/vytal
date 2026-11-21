/**
 * VYTAL React Error Boundary Component
 * Prevents any component runtime exception from turning the page white.
 * Displays a graceful fallback interface with diagnostic details and a retry action.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  sectionName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[VYTAL ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-800 space-y-4 my-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {this.props.fallbackTitle || (this.props.sectionName ? `Unable to display ${this.props.sectionName}` : 'Component Rendering Recovery')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {this.props.fallbackMessage ||
                  'An isolated rendering issue occurred in this section. The rest of the application remains fully functional.'}
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 font-mono text-[11px] text-amber-900 overflow-x-auto">
              {this.state.error.toString()}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="sm"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
