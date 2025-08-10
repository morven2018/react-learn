import style from './error-message.module.scss';
import { RefreshButton } from '@components/ui/refresh-button/refresh-button';

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
  return (
    <div className={style.errorContainer}>
      <div className={style.errorContent}>
        <p className={style.errorText}>{message}</p>
        {onRetry && (
          <RefreshButton onRefresh={onRetry} isLoading={isLoading ?? false} />
        )}
      </div>
    </div>
  );
};
