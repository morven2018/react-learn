'use client';
import DetailsContent from './detail-content';
import style from './details.module.scss';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetCharacterByIdQuery } from '@/services/api/character-api';
import { getErrorMessage } from '@/services/api/error-handler';

interface DetailCardProps {
  characterId: string;
  onClose: () => void;
}

export default function DetailCard({
  characterId,
  onClose,
}: Readonly<DetailCardProps>) {
  const {
    data: character,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetCharacterByIdQuery(characterId, {
    skip: !characterId,
    refetchOnMountOrArgChange: true,
  });
  const t = useTranslations('Detail');

  useEffect(() => {
    if (isError) {
      console.error(t('error'), error);
    }
  }, [isError, error, t]);

  return (
    <div className={style.detailCard}>
      <div className={style.header}>
        <h2 className={style.title}>{t('header')}</h2>

        <div className={style.headerControls}>
          <button
            className={style.closeButton}
            onClick={onClose}
            title={t('close')}
            aria-label={t('close')}
          >
            &times;
          </button>
        </div>
      </div>

      <DetailsContent
        character={character ?? null}
        isLoading={isLoading || isFetching}
        isError={isError}
        errorData={getErrorMessage(error)}
      />
    </div>
  );
}
