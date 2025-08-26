import DetailCard from './detail-card';
import style from './details.module.scss';
import { CloseButton } from './close-button';

interface DetailCardClientProps {
  characterId: string;
}

export default function DetailCardClient({
  characterId,
}: Readonly<DetailCardClientProps>) {
  return (
    <div className={style.detailCard}>
      <CloseButton />
      <DetailCard characterId={characterId} />
    </div>
  );
}
