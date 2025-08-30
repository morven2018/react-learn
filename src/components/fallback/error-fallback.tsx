import styles from './fallback.module.scss';

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
}: ErrorFallbackProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.error}>
        <h2>Something went wrong</h2>
        <p>{error?.message || 'Failed to load data'}</p>
        {onRetry && (
          <button onClick={onRetry} className={styles.retryButton}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
