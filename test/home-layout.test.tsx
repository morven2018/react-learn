import HomeLayout from '@components/layout/home-layout/home-layout';
import { configureStore } from '@reduxjs/toolkit';
import { characterApi } from '@services/api/characterApi';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../detailView/DetailCard', () => ({
  default: vi.fn(({ id, onClose }: { id: string; onClose: () => void }) => (
    <div data-testid="detail-card">
      <div>Detail Card for ID: {id}</div>
      <button onClick={onClose}>Close</button>
    </div>
  )),
}));

const MockOutlet = () => <div data-testid="outlet">Outlet Content</div>;

const mockStore = configureStore({
  reducer: {
    [characterApi.reducerPath]: characterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(characterApi.middleware),
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('HomeLayout', () => {
  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('render Outlet with no DetailCard if details not exist', () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<MockOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('detail-card')).not.toBeInTheDocument();
  });

  it('save page on close DetailCard', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/?details=789&page=3']}>
          <Routes>
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<MockOutlet />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const closeButton = screen.getByRole('button', { name: /close details/i });
    closeButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('?page=3');
  });
});
