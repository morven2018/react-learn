import { beforeEach, describe, expect, it, vi } from 'vitest';

import charactersSlice, {
  clearSelectedCharacters,
  toggleCharacterSelection,
  type CharactersState,
} from '@shared/features/characters-slice';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('charactersSlice', () => {
  let initialState: CharactersState;

  beforeEach(() => {
    initialState = {
      selectedCharacters: [],
    };
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('handle initial state', () => {
    expect(charactersSlice(undefined, { type: '' })).toEqual({
      selectedCharacters: [],
    });
  });

  it('handle toggleCharacterSelection: add character', () => {
    const characterId = '1';
    const nextState = charactersSlice(
      initialState,
      toggleCharacterSelection(characterId)
    );

    expect(nextState.selectedCharacters).toEqual([characterId]);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCharacters',
      JSON.stringify([characterId])
    );
  });

  it('handle toggleCharacterSelection: remove character', () => {
    const characterId = '1';
    const state: CharactersState = { selectedCharacters: [characterId] };
    const nextState = charactersSlice(
      state,
      toggleCharacterSelection(characterId)
    );

    expect(nextState.selectedCharacters).toEqual([]);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCharacters',
      JSON.stringify([])
    );
  });

  it('handle clearSelectedCharacters', () => {
    const state: CharactersState = {
      selectedCharacters: ['1', '2'],
    };
    const nextState = charactersSlice(state, clearSelectedCharacters());

    expect(nextState.selectedCharacters).toEqual([]);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedCharacters',
      JSON.stringify([])
    );
  });
});
