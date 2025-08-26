import DetailCard from './detail-card';
import style from './details.module.scss';
import { CloseButton } from './close-button';

interface DetailCardClientProps {
  characterId: string;
}

export default function DetailCardClient({
  characterId,
}: DetailCardClientProps) {
  return (
    <div className={style.detailWrapper}>
      <div className={style.detailHeader}>
        <CloseButton />
      </div>
      <DetailCard characterId={characterId} />
    </div>
  );
}
