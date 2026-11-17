import React from 'react';
import { AlertOctagon, RotateCcw, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, log to an immutable audit or telemetry service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/command';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="grid-bg min-h-[400px] w-full grid place-items-center rounded-2xl border border-rose-500/40 bg-[#08101e] p-8 text-center shadow-2xl"
        >
          <div className="max-w-md space-y-4 font-mono">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <div className="label text-rose-400">Atmospheric Interface Fault Intercepted</div>
              <h2 className="text-xl font-bold text-white font-display">
                Module Telemetry Recovered
              </h2>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                An isolated client-side rendering exception was caught by AURA's zero-trust safety boundary. Your session and immutable ledger integrity remain intact.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 font-sans text-xs font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Re-initialize Command Module
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
