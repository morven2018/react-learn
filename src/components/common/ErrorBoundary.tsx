import React from 'react';
import style from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private unhandledRejectionHandler?: (event: PromiseRejectionEvent) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    this.registerGlobalHandlers();
  }

  componentWillUnmount() {
    this.unregisterGlobalHandlers();
  }

  private registerGlobalHandlers() {
    this.unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      this.setState({
        hasError: true,
        error:
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
      });
    };

    window.addEventListener(
      'unhandledrejection',
      this.unhandledRejectionHandler
    );
  }

  private unregisterGlobalHandlers() {
    if (this.unhandledRejectionHandler) {
      window.removeEventListener(
        'unhandledrejection',
        this.unhandledRejectionHandler
      );
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className={style.errorBoundary}>
            <h2 className={style.header}>Something went wrong</h2>
            <div className={style.errorDetails}>
              {this.state.error?.toString()}
            </div>
            <button onClick={this.handleReset} className={style.retryButton}>
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
