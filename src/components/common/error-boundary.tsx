'use client';
import React from 'react';
import router from 'next/router';
import style from './error-boundary.module.scss';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  hasLoggedError?: boolean;
}

const defaultErrorMessage = 'Unknown error occurred';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

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
        hasLoggedError: false,
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
    return {
      hasError: true,
      error,
      hasLoggedError: false,
    };
  }

  componentDidCatch() {
    this.setState({
      hasLoggedError: false,
    });
  }

  private getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleString('en-US', DATE_FORMAT_OPTIONS);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      hasLoggedError: false,
    });
    router.push('/');
  };

  render() {
    if (this.state.hasError) {
      if (!this.state.hasLoggedError && this.state.error) {
        console.error('Error caught by boundary:', {
          time: this.getFormattedTime(),
          message: this.state.error.message,
          stack: this.state.error.stack,
        });
        this.setState({ hasLoggedError: true });
      }

      return (
        this.props.fallback || (
          <div className={style.errorBoundary}>
            <h2 className={style.header}>Something went wrong</h2>

            <div className={style.errorMessage}>
              {this.state.error?.message ?? defaultErrorMessage}
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
