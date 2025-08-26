import DetailsContent from './detail-content';
import style from './details.module.scss';
import { getTranslations } from 'next-intl/server';
import { getCharacterById } from '@/services/api/character-api.server';
import { getErrorMessage } from '@/services/api/error-handler';

interface ServerDetailCardProps {
  characterId: string;
}

export default async function DetailCard({
  characterId,
}: ServerDetailCardProps) {
  const t = await getTranslations('Detail');

  let character = null;
  let error = null;

  try {
    character = await getCharacterById(characterId);
  } catch (err) {
    error = err;
  }

  const isError = !!error;

  return (
    <div className={style.detailCard}>
      <div className={style.header}>
        <h2 className={style.title}>{t('header')}</h2>
      </div>

      <DetailsContent
        character={character}
        isError={isError}
        errorData={getErrorMessage(error)}
      />
    </div>
  );
}
