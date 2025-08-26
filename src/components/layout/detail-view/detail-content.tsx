import style from './details.module.scss';
import type { Person } from '@shared/types/response-types';
import { getTranslations } from 'next-intl/server';
import { ExternalLink } from '@/components/ui/link/external-link';

interface DetailsProps {
  character: Person | null;
  isError: boolean;
  errorData: string;
}

const DetailsContent = async ({
  character,
  isError,
  errorData,
}: DetailsProps) => {
  const t = await getTranslations('Content');
  let characterDetails;

  const formatValue = (value: string | null) => {
    if (!value) return null;
    return value === 'NaN' ? null : value;
  };

  if (character && !isError)
    characterDetails = [
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
      {!character && <div className={style.loading}>{t('loading')}</div>}
      {isError && (
        <div className={style.noData}>
          {t('noData')} <br />
          <span className={style.errorDetail}>{errorData}</span>
        </div>
      )}
      {characterDetails && character && (
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
