import CharacterApiService from '@services/api/api-service';
import type { Person } from '@shared/types/responseTypes';
import { useEffect, useState } from 'react';

export const useCharacterDetails = (id: string) => {
  const [character, setCharacter] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await CharacterApiService.getCharacterById(id);
        setCharacter(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return {
    data: character,
    isLoading,
  };
};
