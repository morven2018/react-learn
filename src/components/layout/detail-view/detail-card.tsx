import DetailsContent from './detail-content';
import style from './details.module.scss';
import { useAppSelector } from '@redux/store';
import { useGetCharacterByIdQuery } from '@services/api/character-api';
import { getErrorMessage } from '@services/api/error-handler';
import { useEffect } from 'react';

interface DetailCardProps {
  id: string;
  onClose: () => void;
  isLoading?: boolean;
}

export const DetailCard = ({ id, onClose, isLoading }: DetailCardProps) => {
  const refreshVersion = useAppSelector((state) => state.refresh.version);
  const {
    data: character,
    isLoading: isDetailsLoading,
    isError,
    error,
    refetch,
  } = useGetCharacterByIdQuery(id, {
    skip: !id,
  });
  useEffect(() => {
    if (refreshVersion > 0) {
      refetch();
    }
  }, [refreshVersion, refetch]);

  return (
    <div className={style.detailCard}>
      <div className={style.header}>
        <h2 className={style.title}>Character Details</h2>
        <div className={style.headerControls}>
          <button
            className={style.closeButton}
            onClick={onClose}
            aria-label="Close details"
          >
            &times;
          </button>
        </div>
      </div>

      <DetailsContent
        character={character ?? null}
        isLoading={isLoading || isDetailsLoading}
        isError={isError}
        errorData={getErrorMessage(error)}
      />
    </div>
  );
};
