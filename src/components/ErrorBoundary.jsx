import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-primary">
          <div className="w-20 h-20 rounded-full bg-danger-alpha flex items-center justify-center mb-6">
            <AlertTriangle size={36} className="text-danger" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-secondary text-sm mb-8 max-w-xs leading-relaxed">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary rounded-xl flex items-center gap-2"
          >
            <RefreshCw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
