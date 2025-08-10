import convertToCSV from '@shared/lib/convert-to-csv';
import { Flyout } from '@components/ui/flyout/Flyout';
import { configureStore } from '@reduxjs/toolkit';
import { useLazyGetCharactersByIdsQuery } from '@services/api/character-api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import charactersSlice, {
  clearSelectedCharacters,
} from '@shared/features/characters-slice';

vi.mock('@shared/lib/convert-to-csv', () => ({
  default: vi.fn(),
}));

vi.mock('@services/api/character-api', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@services/api/character-api')>();
  return {
    ...original,
    useLazyGetCharactersByIdsQuery: vi.fn(),
  };
});

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

  const createTestStore = () => {
    return configureStore({
      reducer: {
        characters: charactersSlice,
      },
      preloadedState: {
        characters: {
          selectedCharacters: ['1', '2'],
        },
      },
    });
  };

  let store: ReturnType<typeof createTestStore>;
  const mockedUseLazyGetCharactersByIdsQuery = vi.mocked(
    useLazyGetCharactersByIdsQuery
  );

  beforeEach(() => {
    store = createTestStore();
    vi.mocked(convertToCSV).mockReturnValue('csv data');

    mockedUseLazyGetCharactersByIdsQuery.mockReturnValue([
      vi.fn().mockResolvedValue({ data: mockCharacters }),
      {
        data: mockCharacters,
        isLoading: false,
        isError: false,
        isSuccess: true,
        isUninitialized: false,
        refetch: vi.fn(),
        reset: vi.fn(),
        status: 'fulfilled',
      },
      { lastArg: [''] },
    ]);
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
    const emptyStore = configureStore({
      reducer: {
        characters: charactersSlice,
      },
      preloadedState: {
        characters: { selectedCharacters: [] },
      },
    });

    const { container } = render(
      <Provider store={emptyStore}>
        <Flyout />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('dispatch clearSelectedCharacters action on "Unselect all" button click', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    fireEvent.click(screen.getByText('Unselect all'));
    expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedCharacters());
  });

  it('download characters on Download button click', async () => {
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
      const triggerFn =
        mockedUseLazyGetCharactersByIdsQuery.mock.results[0].value[0];
      expect(triggerFn).toHaveBeenCalledWith(['1', '2']);

      expect(convertToCSV).toHaveBeenCalledWith(mockCharacters);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    document.body.removeChild(div);
  });
});
