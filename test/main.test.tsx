import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockRender = vi.fn();
const mockUnmount = vi.fn();

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn().mockImplementation(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

describe('app', () => {
  let rootElement: HTMLElement;

  beforeEach(() => {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
  });

  it('render app inside root', async () => {
    await import('src/main');

    expect(createRoot).toHaveBeenCalledWith(rootElement);
    expect(mockRender).toHaveBeenCalled();
  });
});
