import Controls from '../../src/components/controls/controls';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Forms } from '../../src/shared/types/types';

jest.mock('./controls.module.scss', () => ({
  __esModule: true,
  default: {
    wrapper: 'controls-wrapper',
  },
}));

describe('Controls Component', () => {
  const mockOnFormSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render buttons', () => {
    render(<Controls onFormSelect={mockOnFormSelect} />);

    expect(
      screen.getByText('Uncontrolled components form')
    ).toBeInTheDocument();
    expect(screen.getByText('With React Hook Form')).toBeInTheDocument();
  });

  it('call onFormSelect on Uncontrolled button click', async () => {
    render(<Controls onFormSelect={mockOnFormSelect} />);

    const uncontrolledButton = screen.getByText('Uncontrolled components form');
    await userEvent.click(uncontrolledButton);

    expect(mockOnFormSelect).toHaveBeenCalledWith(Forms.Uncontrolled);
  });

  it('call onFormSelect on HookForm button is click', async () => {
    render(<Controls onFormSelect={mockOnFormSelect} />);

    const hookFormButton = screen.getByText('With React Hook Form');
    await userEvent.click(hookFormButton);

    expect(mockOnFormSelect).toHaveBeenCalledWith(Forms.HookForm);
  });
});
