import CharacterApiService from '@services/api/apiService';
import { useCharacterDetails } from '@components/hooks/useCharacterDetails';
import { useRestoreSearchTerm } from '@components/hooks/useRestoreSearchTerm';
import { Term } from '@services/localStorage/LSService';
import type { Person } from '@shared/types/responseTypes';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@services/api/apiService');

const mockCharacter: Person = {
  _id: '123',
  name: 'Aragorn',
  wikiUrl: 'https://lotr.fandom.com/wiki/Aragorn',
  race: '',
  gender: '',
  birth: '',
  death: '',
  realm: '',
  height: '',
  hair: '',
  spouse: '',
};

describe('useCharacterDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('return initial loading state', () => {
    vi.mocked(CharacterApiService.getCharacterById).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useCharacterDetails('123'));

    expect(result.current).toEqual({
      data: null,
      isLoading: true,
    });
  });

  it('fetch character details successfully', async () => {
    vi.mocked(CharacterApiService.getCharacterById).mockResolvedValue(
      mockCharacter
    );

    const { result } = renderHook(() => useCharacterDetails('123'));

    expect(result.current).toEqual({
      data: null,
      isLoading: true,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      data: mockCharacter,
      isLoading: false,
    });
    expect(CharacterApiService.getCharacterById).toHaveBeenCalledWith('123');
  });

  it('handle empty id', () => {
    const { result } = renderHook(() => useCharacterDetails(''));

    expect(result.current).toEqual({
      data: null,
      isLoading: false,
    });
    expect(CharacterApiService.getCharacterById).not.toHaveBeenCalled();
  });

  it('cancel pending request when unmounted', () => {
    vi.mocked(CharacterApiService.getCharacterById).mockImplementation(
      () => new Promise(() => {})
    );

    const { unmount } = renderHook(() => useCharacterDetails('123'));
    unmount();

    expect(CharacterApiService.getCharacterById).toHaveBeenCalled();
  });
});

vi.mock('@services/localStorage/LSService', () => ({
  Term: {
    getTermFromLS: vi.fn(),
    setTermToLS: vi.fn(),
  },
}));

const mockedTerm = vi.mocked(Term);

describe('useRestoreSearchTerm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initialize with empty term if LS is empty', () => {
    mockedTerm.getTermFromLS.mockReturnValue(undefined);

    const { result } = renderHook(() => useRestoreSearchTerm());

    expect(result.current.termValue).toBe('');
    expect(mockedTerm.getTermFromLS).toHaveBeenCalledOnce();
  });

  it('initialize with term from LS', () => {
    const mockTerm = 'test term';
    mockedTerm.getTermFromLS.mockReturnValue(mockTerm);

    const { result } = renderHook(() => useRestoreSearchTerm());

    expect(result.current.termValue).toBe(mockTerm);
    expect(mockedTerm.getTermFromLS).toHaveBeenCalledOnce();
  });

  it('update term value and save to LS', () => {
    vi.mocked(Term.getTermFromLS).mockReturnValue('');
    const { result } = renderHook(() => useRestoreSearchTerm());

    const newTerm = 'new search term';
    act(() => {
      result.current.updateTermValue(newTerm);
    });

    expect(result.current.termValue).toBe(newTerm);
    expect(Term.setTermToLS).toHaveBeenCalledWith(newTerm);
  });

  it('handle empty string updates', () => {
    vi.mocked(Term.getTermFromLS).mockReturnValue('initial');
    const { result } = renderHook(() => useRestoreSearchTerm());

    act(() => {
      result.current.updateTermValue('');
    });

    expect(result.current.termValue).toBe('');
    expect(Term.setTermToLS).toHaveBeenCalledWith('');
  });
});
