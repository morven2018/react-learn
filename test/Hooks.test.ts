import { useCharacterDetails } from '@components/hooks/use-character-details';
import { useRestoreSearchTerm } from '@components/hooks/use-restore-searchTerm';
import { useGetCharacterByIdQuery } from '@services/api/characterApi';
import { Term } from '@services/localStorage/LS-service';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@services/api/characterApi');

const mockCharacter = {
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
  const mockUseGetCharacterByIdQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetCharacterByIdQuery).mockImplementation(
      (id, { skip } = { skip: false }) => {
        if (skip) {
          return {
            data: undefined,
            isLoading: false,
            isError: false,
            error: undefined,
          };
        }
        return mockUseGetCharacterByIdQuery(id);
      }
    );
  });

  it('return initial loading state', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    });

    const { result } = renderHook(() => useCharacterDetails('123'));

    expect(result.current).toEqual({
      character: null,
      isDetailsLoading: true,
      isError: false,
      error: undefined,
    });
  });

  it('fetch character details successfully', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: mockCharacter,
      isLoading: false,
      isError: false,
      error: undefined,
    });

    const { result } = renderHook(() => useCharacterDetails('123'));

    await waitFor(() => expect(result.current.isDetailsLoading).toBe(false));

    expect(result.current).toEqual({
      character: mockCharacter,
      isDetailsLoading: false,
      isError: false,
      error: undefined,
    });
  });

  it('handle empty id', () => {
    const { result } = renderHook(() => useCharacterDetails(''));

    expect(result.current).toEqual({
      character: null,
      isDetailsLoading: false,
      isError: false,
      error: undefined,
    });
  });

  it('handle error state', () => {
    const mockError = new Error('Failed to fetch');
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    });

    const { result } = renderHook(() => useCharacterDetails('123'));

    expect(result.current).toEqual({
      character: null,
      isDetailsLoading: false,
      isError: true,
      error: mockError,
    });
  });
});

vi.mock('@services/localStorage/LS-service', () => ({
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
