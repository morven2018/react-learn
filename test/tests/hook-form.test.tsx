import HookForm from '../../src/components/forms/hook-form';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { ChangeEvent } from 'react';

interface AccordionProps {
  title: string;
}

interface AutocompleteCountryProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface ConverterFunction {
  (file: File): Promise<string>;
}

interface DebounceFunction {
  <T extends (...args: unknown[]) => void>(fn: T, delay: number): T;
}

jest.mock('../../src/components/accordion/accordion', () => ({
  __esModule: true,
  default: ({ title }: AccordionProps) => (
    <div data-testid="accordion-mock">{title}</div>
  ),
}));

jest.mock(
  '../../src/components/autocomplete-country/autocomplete-country',
  () => ({
    __esModule: true,
    default: ({
      value,
      onChange,
      error,
      onInputChange,
    }: AutocompleteCountryProps) => (
      <div>
        <input
          type="text"
          value={value || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
            onInputChange?.(e);
          }}
          placeholder="Country input"
          data-testid="country-input"
        />
        {error && <span data-testid="country-error">{error}</span>}
      </div>
    ),
  })
);

jest.mock('../../src/shared/lib/converter', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockResolvedValue(
      'data:image/jpeg;base64,mock-base64-data'
    ) as ConverterFunction,
}));

jest.mock('../../src/shared/lib/debounce', () => ({
  __esModule: true,
  default: jest.fn((fn, delay) => fn) as DebounceFunction,
}));

jest.mock('../../src/components/forms/fields', () => ({
  __esModule: true,
  getPasswordStrength: jest.fn().mockReturnValue(3),
  strengthLabels: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'],
}));

describe('HookForm Component', () => {
  const mockOnSubmitSuccess = jest.fn();
  const mockOnSaveDraft = jest.fn();
  const defaultDraftData = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (draftData = defaultDraftData, onReset = false) => {
    return render(
      <HookForm
        onSubmitSuccess={mockOnSubmitSuccess}
        draftData={draftData}
        onSaveDraft={mockOnSaveDraft}
        onReset={onReset}
      />
    );
  };

  const fillValidForm = async () => {
    await userEvent.type(screen.getByLabelText(/name:/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/age:/i), '25');
    await userEvent.type(screen.getByLabelText(/email:/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password:'), 'Password123!');
    await userEvent.type(
      screen.getByLabelText(/confirm password:/i),
      'Password123!'
    );
    await userEvent.click(screen.getByLabelText('Male'));
    await userEvent.click(screen.getByLabelText(/i accepted condition/i));

    const countryInput = screen.getByTestId('country-input');
    await userEvent.type(countryInput, 'United States');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/picture \(required\):/i);
    await userEvent.upload(fileInput, file);
  };

  it('render all form fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText(/female/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i accepted condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/picture \(required\):/i)).toBeInTheDocument();
    expect(screen.getByTestId('country-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validate name format', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/name:/i);
    await userEvent.type(nameInput, 'john doe');
    await userEvent.tab();

    expect(
      await screen.findByText(/the name should start on uppercase letter/i)
    ).toBeInTheDocument();
  });

  it('validate email format', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email:/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();

    expect(await screen.findByText(/input correct email/i)).toBeInTheDocument();
  });

  it('validate password strength', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password:');
    await userEvent.type(passwordInput, 'weak');
    await userEvent.tab();

    expect(await screen.findByText(/1 digit/i)).toBeInTheDocument();
  });

  it('handle image upload and preview', async () => {
    renderComponent();

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/picture \(required\):/i);

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    });
  });

  it('load draft data when provided', async () => {
    const draftData = {
      name: 'Jane Doe',
      age: 30,
      email: 'jane@example.com',
      password: 'Draft123!',
      confirmPassword: 'Draft123!',
      gender: 'female' as const,
      acceptTerms: true,
      picture: 'data:image/png;base64,draft-image-data',
      country: 'Canada',
    };

    renderComponent(draftData);

    expect(screen.getByLabelText(/name:/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/age:/i)).toHaveValue(30);
    expect(screen.getByLabelText(/email:/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText('Password:')).toHaveValue('Draft123!');
    expect(screen.getByLabelText(/confirm password:/i)).toHaveValue(
      'Draft123!'
    );
    expect(screen.getByLabelText(/female/i)).toBeChecked();
    expect(screen.getByLabelText(/i accepted condition/i)).toBeChecked();
    expect(screen.getByTestId('country-input')).toHaveValue('Canada');
  });

  it('save draft on form change', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/name:/i);
    await userEvent.type(nameInput, 'Test');

    await waitFor(() => {
      expect(mockOnSaveDraft).toHaveBeenCalled();
    });

    const draftData = mockOnSaveDraft.mock.calls[0][0];
    expect(draftData.name).toBe('T');
  });

  it('disable submit button when form is invalid', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/name:/i), 'John Doe');
    expect(submitButton).toBeDisabled();
  });

  it('enable submit button when form is valid', async () => {
    renderComponent();

    await fillValidForm();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('show password strength indicator', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password:');
    await userEvent.type(passwordInput, 'Password123!');

    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
