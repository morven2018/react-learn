import { Term } from '@services/localStorage/LastTerm';
import { useCallback, useState } from 'react';

export const useRestoreSearchTerm = () => {
  const [termValue, setTermValue] = useState<string>(() => {
    return Term.getTermFromLS() ?? '';
  });

  const updateTermValue = useCallback((newTerm: string) => {
    setTermValue(newTerm);
    Term.setTermToLS(newTerm);
  }, []);

  return { termValue, updateTermValue };
};
