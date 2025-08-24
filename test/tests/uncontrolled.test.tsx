import UncontrolledForm from '../../src/components/forms/uncontrolled';
import convertToBase64 from '../../src/shared/lib/converter';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChangeEvent } from 'react';
import { formSchema } from '../../src/schemas/formSchema';

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

jest.mock('../../src/shared/lib/converter', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockResolvedValue('data:image/jpeg;base64,mock-base64-data'),
}));

jest.mock('../../src/shared/lib/debounce', () => ({
  __esModule: true,
  default: jest.fn((fn) => fn),
}));

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
jest.mock('../../src/components/forms/fields', () => ({
  __esModule: true,
  getPasswordStrength: jest.fn().mockReturnValue(3),
  strengthLabels: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'],
}));

describe('UncontrolledForm', () => {
  const mockOnSubmitSuccess = jest.fn();
  const mockOnSaveDraft = jest.fn();
  const defaultDraftData = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (draftData = defaultDraftData) => {
    return render(
      <UncontrolledForm
        onSubmitSuccess={mockOnSubmitSuccess}
        draftData={draftData}
        onSaveDraft={mockOnSaveDraft}
      />
    );
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
    expect(screen.getByLabelText(/picture:/i)).toBeInTheDocument();
    expect(screen.getByTestId('country-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('show password strength indicator', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password:');
    await userEvent.type(passwordInput, 'Password123!');

    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('handle image upload and preview', async () => {
    renderComponent();

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/picture:/i);

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(convertToBase64).toHaveBeenCalledWith(file);
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    });
  });

  it('show validation errors for invalid form', async () => {
    renderComponent({ ...defaultDraftData, age: -9 });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    expect(await screen.findAllByText(/age/i)).toHaveLength(1);
  });

  it('clear errors when form changes', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    const nameInput = screen.getByLabelText(/name:/i);
    await userEvent.type(nameInput, 'John Doe');

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  it('handle form schema validation correctly', async () => {
    const validData = {
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as const,
      acceptTerms: true,
      picture: 'data:image/jpeg;base64,test',
      country: 'United States',
    };

    expect(() => formSchema.parse(validData)).not.toThrow();

    const invalidData = { ...validData, email: 'invalid-email' };
    expect(() => formSchema.parse(invalidData)).toThrow();
  });

  it('handle file upload and conversion', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    renderComponent();

    const fileInput = screen.getByLabelText(/picture:/i);

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(convertToBase64).toHaveBeenCalledWith(file);
    });
  });
});
