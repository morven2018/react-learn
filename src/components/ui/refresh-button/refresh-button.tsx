import style from './refresh-button.module.scss';
import { useCallback, useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const RefreshButton = ({ onRefresh, isLoading }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = useCallback(async () => {
    setIsRefreshing(true);
    try {
      onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isRefreshing}
      className={`${style.refreshButton}`}
      aria-label="Refresh data"
    >
      Refresh
    </button>
  );
};
