import { useGetCharacterByIdQuery } from '@services/api/characterApi';

export const useCharacterDetails = (id: string) => {
  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useGetCharacterByIdQuery(id, {
    skip: !id,
  });

  return {
    character: character ?? null,
    isDetailsLoading: isLoading,
    isError,
    error,
  };
};
