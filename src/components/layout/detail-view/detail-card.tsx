'use client';
import DetailsContent from './detail-content';
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

  useEffect(() => {
    if (isError) {
      console.error('Failed to load character:', error);
    }
  }, [isError, error]);

  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h2>
          {isLoading || isFetching
            ? 'Loading...'
            : character?.name || 'Unknown Character'}
        </h2>
        <button onClick={onClose}>×</button>
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
