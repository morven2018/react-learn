import DetailsContent from './detailContent';
import style from './Details.module.scss';
import { useCharacterDetails } from '@components/hooks/useCharacterDetails';

interface DetailCardProps {
  id: string;
  onClose: () => void;
  isLoading?: boolean;
}

export const DetailCard = ({ id, onClose, isLoading }: DetailCardProps) => {
  const { data: character, isLoading: isDetailsLoading } =
    useCharacterDetails(id);

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
        character={character}
        isLoading={isLoading || isDetailsLoading}
      />
    </div>
  );
};
