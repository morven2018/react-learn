'use client';
import DetailsContent from './detail-content';
import { useEffect, useState } from 'react';
import type { Person } from '@/shared/types/response-types';

interface DetailCardProps {
  character: Person;
  onClose: () => void;
}

export default function DetailCard({
  character,
  onClose,
}: Readonly<DetailCardProps>) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!character) {
      setIsLoading(true);
    }
  }, [character]);

  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h2>{character?.name || 'Character Details'}</h2>
        <button onClick={onClose}>×</button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DetailsContent
          character={character}
          isLoading={false}
          isError={false}
          errorData={''}
        />
      )}
    </div>
  );
}
