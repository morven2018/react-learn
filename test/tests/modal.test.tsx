import Modal from '../../src/components/modal/modal';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../src/components/modal/portal', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="portal-container">{children}</div>
    ),
  };
});

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnResetForm = jest.fn();

  const defaultProps = {
    isOpen: true,
    title: 'Test Modal',
    children: <div data-testid="modal-content">Modal Content</div>,
    onClose: mockOnClose,
    onResetForm: mockOnResetForm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('not render if isOpen = false', () => {
    const { queryByTestId } = render(
      <Modal {...defaultProps} isOpen={false} />
    );

    expect(queryByTestId('portal-container')).toBeNull();
  });

  it('render modal with title and content if isOpen = true', () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset form')).toBeInTheDocument();
  });

  it('call onClose on close button click', () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('call onResetForm on reset button click', () => {
    render(<Modal {...defaultProps} />);

    const resetButton = screen.getByLabelText('Reset form');
    fireEvent.click(resetButton);

    expect(mockOnResetForm).toHaveBeenCalledTimes(1);
  });

  it('call onClose on Esc key press', () => {
    render(<Modal {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('call onClose on overlay click', () => {
    render(<Modal {...defaultProps} />);

    const portalContainer = screen.getByTestId('portal-container');
    const overlay = portalContainer.firstChild as HTMLElement;

    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('not call onClose on modal content click', () => {
    render(<Modal {...defaultProps} />);

    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('clean up event listeners on unmount', () => {
    const { unmount } = render(<Modal {...defaultProps} />);

    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
