import { useRestoreSearchTerm } from '@components/hooks/use-restore-searchTerm';
import { Term } from '@services/localStorage/LS-service';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@services/api/characterApi');

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
