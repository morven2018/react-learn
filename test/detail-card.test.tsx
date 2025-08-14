import userEvent from '@testing-library/user-event';
import { DetailCard } from '@components/layout/detail-view/detail-card';
import { store } from '@redux/store';
import { useGetCharacterByIdQuery } from '@services/api/character-api';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

vi.mock('@services/api/character-api', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@services/api/character-api')>();
  return {
    ...original,
    useGetCharacterByIdQuery: vi.fn(),
  };
});

vi.mock('@components/layout/detail-view/detail-content', () => ({
  default: vi.fn(() => <div>DetailsContent Mock</div>),
}));

describe('DetailCard', () => {
  const mockOnClose = vi.fn();
  const mockedUseGetCharacterByIdQuery = vi.mocked(useGetCharacterByIdQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseGetCharacterByIdQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it('render with title and close button', () => {
    render(
      <Provider store={store}>
        <DetailCard id="123" onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Character Details')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close details/i })
    ).toBeInTheDocument();
  });

  it('call onClose on close button is click', async () => {
    render(
      <Provider store={store}>
        <DetailCard id="123" onClose={mockOnClose} />
      </Provider>
    );

    await userEvent.click(
      screen.getByRole('button', { name: /close details/i })
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('pass correct id to useGetCharacterByIdQuery', () => {
    render(
      <Provider store={store}>
        <DetailCard id="123" onClose={mockOnClose} />
      </Provider>
    );

    expect(mockedUseGetCharacterByIdQuery).toHaveBeenCalledWith('123', {
      skip: false,
    });
  });

  it('handle empty id', () => {
    render(
      <Provider store={store}>
        <DetailCard id="" onClose={mockOnClose} />
      </Provider>
    );

    expect(mockedUseGetCharacterByIdQuery).toHaveBeenCalledWith('', {
      skip: true,
    });
  });
});
