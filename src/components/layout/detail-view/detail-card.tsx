import DetailsContent from './detail-content';
import style from './details.module.scss';
import { useGetCharacterByIdQuery } from '@services/api/characterApi';
import { getErrorMessage } from '@services/api/error-handler';

interface DetailCardProps {
  id: string;
  onClose: () => void;
  isLoading?: boolean;
}

export const DetailCard = ({ id, onClose, isLoading }: DetailCardProps) => {
  const {
    data: character,
    isLoading: isDetailsLoading,
    isError,
    error,
  } = useGetCharacterByIdQuery(id, {
    skip: !id,
  });

  return (
    <div className={style.detailCard}>
      <div className={style.header}>
        <h2 className={style.title}>Character Details</h2>
        <button
          className={style.closeButton}
          onClick={onClose}
          aria-label="Close details"
        >
          &times;
        </button>
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
