import CharacterApiService from '@services/api/apiService';
import convertToCSV from '@shared/lib/convertToCSV';
import { Flyout } from '@components/ui/flyout/Flyout';
import type { RootState } from '@redux/store';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import charactersSlice, {
  clearSelectedCharacters,
} from '@shared/features/charactersSlice';

vi.mock('@services/api/apiService', () => ({
  default: {
    getCharactersByIds: vi.fn(),
  },
}));

vi.mock('@shared/lib/convertToCSV', () => ({
  default: vi.fn(),
}));

describe('Flyout Component', () => {
  const mockCharacters = [
    {
      _id: '1',
      name: 'Gandalf',
      url: '/character/1',
      wikiUrl: '',
      race: 'Maia',
      birth: 'Before creation of Arda',
      gender: 'Male',
      death: 'Immortal',
      hair: 'White',
      height: '',
      spouse: '',
      realm: '',
    },
  ];

  const createTestStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
      reducer: {
        characters: charactersSlice,
      },
      preloadedState: {
        characters: {
          selectedCharacters: ['1', '2'],
          ...preloadedState?.characters,
        },
      },
    });
  };

  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.mocked(CharacterApiService.getCharactersByIds).mockResolvedValue(
      mockCharacters
    );
    vi.mocked(convertToCSV).mockReturnValue('csv data');
  });

  it('render correctly if selectedCharacters not empty', () => {
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Items selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('not render if selectedCharacters empty', () => {
    const emptyStore = createTestStore({
      characters: { selectedCharacters: [] },
    });

    const { container } = render(
      <Provider store={emptyStore}>
        <Flyout />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('dispatch clearSelectedCharacters action on "Unselect all" button click', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    fireEvent.click(screen.getByText('Unselect all'));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedCharacters());
    });
  });

  it('download characters on "Download" button click', async () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    const mockCreateObjectURL = vi.fn(() => 'mock-url');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>,
      { container: div }
    );

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(CharacterApiService.getCharactersByIds).toHaveBeenCalledWith([
        '1',
        '2',
      ]);
      expect(convertToCSV).toHaveBeenCalledWith(mockCharacters);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    document.body.removeChild(div);
  });
});
