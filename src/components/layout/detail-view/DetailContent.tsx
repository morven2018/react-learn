import style from './Details.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface DetailsProps {
  character: Person | null;
  isLoading: boolean;
}

const emptyLink = '#';

const DetailsContent = ({ character, isLoading }: DetailsProps) => {
  if (!character) return null;

  const formatValue = (value: string | null) => {
    if (!value) return null;
    return value === 'NaN' ? null : value;
  };

  const characterDetails = [
    { label: 'Race', value: formatValue(character.race) },
    { label: 'Birth', value: formatValue(character.birth) },
    { label: 'Gender', value: formatValue(character.gender) },
    { label: 'Death', value: formatValue(character.death) },
    { label: 'Hair', value: formatValue(character.hair) },
    { label: 'Height', value: formatValue(character.height) },
    { label: 'Realm', value: formatValue(character.realm) },
    { label: 'Spouse', value: formatValue(character.spouse) },
  ].filter((item) => item.value !== null);

  return (
    <div className={style.detailsContainer}>
      {isLoading ? (
        <div className={style.loading}>Loading details...</div>
      ) : (
        <>
          <div className={style.header}>
            <h2 className={style.characterName}>{character.name}</h2>
          </div>

          <div className={style.detailsContent}>
            <a
              href={character.wikiUrl ?? emptyLink}
              aria-disabled={!character.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={character.wikiUrl ? style.wikiLink : style.disableLink}
              onClick={(e) => !character.wikiUrl && e.preventDefault()}
            >
              You can see more information about this character on Lotr wiki
            </a>

            {characterDetails.length > 0 ? (
              <div className={style.detailsList}>
                {characterDetails.map((detail) => (
                  <div key={detail.label} className={style.detailsRow}>
                    <span className={style.detailLabel}>{detail.label}:</span>
                    <span className={style.detailValue}>{detail.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={style.noDetails}>
                No additional details available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsContent;
