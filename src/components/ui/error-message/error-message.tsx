import style from './error-message.module.scss';
import { RefreshButton } from '@components/ui/refresh-button/refresh-button';
import { useState } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const ErrorMessage = ({
  message,
  onRetry,
  isLoading,
}: ErrorMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={style.overlay}
      onClick={handleClose}
      role="alert"
      aria-live="assertive"
    >
      <div className={style.errorContent}>
        <button
          className={style.closeButton}
          onClick={handleClose}
          aria-label="Close error message"
        >
          &times;
        </button>
        <p className={style.errorText}>{message}</p>
        <div className={style.buttonsGroup}>
          {onRetry && (
            <RefreshButton onRefresh={onRetry} isLoading={isLoading ?? false} />
          )}
        </div>
      </div>
    </div>
  );
};
