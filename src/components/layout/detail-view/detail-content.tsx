import style from './details.module.scss';
import type { Person } from '@shared/types/response-types';
import { useTranslations } from 'next-intl';
import { ExternalLink } from '@/components/ui/link/external-link';

interface DetailsProps {
  character: Person | null;
  isLoading: boolean;
  isError: boolean;
  errorData: string;
}

const DetailsContent = ({
  character,
  isLoading,
  isError,
  errorData,
}: DetailsProps) => {
  const t = useTranslations('Content');

  const formatValue = (value: string | null) => {
    if (!value) return null;
    return value === 'NaN' ? null : value;
  };

  const characterDetails = [
    { key: 'race', value: character?.race },
    { key: 'gender', value: character?.gender },
    { key: 'birth', value: character?.birth },
    { key: 'death', value: character?.death },
    { key: 'hair', value: character?.hair },
    { key: 'height', value: character?.height },
    { key: 'realm', value: character?.realm },
    { key: 'spouse', value: character?.spouse },
  ]
    .map((item) => ({
      label: t(`labels.${item.key}`),
      value: formatValue(item.value ?? ''),
    }))
    .filter((item) => item.value !== null);

  return (
    <div className={style.detailsContainer}>
      {(isLoading || !character) && (
        <div className={style.loading}>{t('loading')}</div>
      )}
      {isError && (
        <div className={style.noData}>
          {t('noData')} <br />
          <span className={style.errorDetail}>{errorData}</span>
        </div>
      )}
      {!(isLoading || isError) && character && (
        <>
          <div className={style.header}>
            <h2 className={style.characterName}>{character?.name ?? ''}</h2>
          </div>

          <div className={style.detailsContent}>
            {characterDetails.length ? (
              <div className={style.detailsList}>
                {characterDetails.map((detail) => (
                  <div key={detail.label} className={style.detailsRow}>
                    <span className={style.detailLabel}>{detail.label}:</span>
                    <span className={style.detailValue}>{detail.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={style.noDetails}>{t('noDetails')}</div>
            )}

            <ExternalLink
              href={character.wikiUrl || '#'}
              aria-disabled={!character.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={character.wikiUrl ? style.wikiLink : style.disableLink}
              onClick={(e) => !character.wikiUrl && e.preventDefault()}
            >
              {t('wikiLink')}
            </ExternalLink>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsContent;
