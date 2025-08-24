import App from '../../src/App';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks';
import { FormValues } from '../../src/schemas/formSchema';
import { Forms, Submission } from '../../src/shared/types/types';

const password = '123456';

jest.mock('../../src/components/controls/controls', () => ({
  __esModule: true,
  default: ({ onFormSelect }: { onFormSelect: (formType: Forms) => void }) => (
    <div data-testid="controls">
      <button onClick={() => onFormSelect(Forms.Uncontrolled)}>
        Uncontrolled Button
      </button>
      <button onClick={() => onFormSelect(Forms.HookForm)}>
        HookForm Button
      </button>
    </div>
  ),
}));

jest.mock('../../src/components/forms/hook-form', () => ({
  __esModule: true,
  default: ({
    onSubmitSuccess,
    onSaveDraft,
    draftData,
  }: {
    onSubmitSuccess: (data: FormValues) => void;
    onSaveDraft: (data: Partial<FormValues>) => void;
    draftData?: Partial<FormValues>;
  }) => (
    <div data-testid="hook-form">
      <button
        onClick={() =>
          onSubmitSuccess({
            name: 'Test',
            email: 'test@test.com',
            password: password,
            acceptTerms: true,
          } as FormValues)
        }
      >
        Submit HookForm
      </button>
      <button onClick={() => onSaveDraft({ name: 'Draft' })}>Save Draft</button>
      <div data-testid="draft-data">{JSON.stringify(draftData)}</div>
    </div>
  ),
}));

jest.mock('../../src/components/forms/uncontrolled', () => ({
  __esModule: true,
  default: ({
    onSubmitSuccess,
    onSaveDraft,
    draftData,
  }: {
    onSubmitSuccess: (data: FormValues) => void;
    onSaveDraft: (data: Partial<FormValues>) => void;
    draftData?: Partial<FormValues>;
  }) => (
    <div data-testid="uncontrolled-form">
      <button
        onClick={() =>
          onSubmitSuccess({
            name: 'Test',
            email: 'test@test.com',
            password: password,
            acceptTerms: true,
          } as FormValues)
        }
      >
        Submit Uncontrolled
      </button>
      <button onClick={() => onSaveDraft({ name: 'Draft' })}>Save Draft</button>
      <div data-testid="draft-data">{JSON.stringify(draftData)}</div>
    </div>
  ),
}));

jest.mock('../../src/components/modal/modal', () => ({
  __esModule: true,
  default: ({
    isOpen,
    title,
    children,
    onClose,
    onResetForm,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onResetForm?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        <button onClick={onResetForm} data-testid="reset-button">
          Reset Form
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock('../../src/components/result/result', () => ({
  __esModule: true,
  default: ({ submissions }: { submissions: Submission[] }) => (
    <div data-testid="results">Submissions: {submissions.length}</div>
  ),
}));

jest.mock('../../src/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

const mockDispatch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const mockState = {
        form: {
          isModalOpen: false,
          modalTitle: '',
          currentFormType: null,
          submissions: [],
          draftData: {
            [Forms.Uncontrolled]: null,
            [Forms.HookForm]: null,
          },
        },
      };
      return selector(mockState);
    });
  });

  const renderApp = (initialState = {}) => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const mockState = {
        form: {
          isModalOpen: false,
          modalTitle: '',
          currentFormType: null,
          submissions: [],
          draftData: {
            [Forms.Uncontrolled]: null,
            [Forms.HookForm]: null,
          },
          ...initialState,
        },
      };
      return selector(mockState);
    });

    return render(<App />);
  };

  it('render header and controls', () => {
    renderApp();

    expect(screen.getByText('React Forms')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('open modal for uncontrolled form on button click', async () => {
    renderApp();

    await userEvent.click(screen.getByText('Uncontrolled Button'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'form/openModal',
      payload: {
        title: 'Form with uncontrolled Elements',
        type: Forms.Uncontrolled,
      },
    });
  });

  it('open modal for hook form on button click', async () => {
    renderApp();

    await userEvent.click(screen.getByText('HookForm Button'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'form/openModal',
      payload: {
        title: 'Form with React Hook Form',
        type: Forms.HookForm,
      },
    });
  });

  it('render uncontrolled form in modal when opened', () => {
    renderApp({
      isModalOpen: true,
      modalTitle: 'Form with uncontrolled Elements',
      currentFormType: Forms.Uncontrolled,
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(
      screen.getByText('Form with uncontrolled Elements')
    ).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('close modal on close button click', async () => {
    renderApp({
      isModalOpen: true,
      modalTitle: 'Test Modal',
      currentFormType: Forms.Uncontrolled,
    });

    await userEvent.click(screen.getByText('Close Modal'));

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'form/closeModal' });
  });

  it('call dispatch clearDraft action on reset button click', async () => {
    renderApp({
      isModalOpen: true,
      modalTitle: 'Test Modal',
      currentFormType: Forms.Uncontrolled,
      draftData: {
        [Forms.Uncontrolled]: { name: 'test' },
        [Forms.HookForm]: null,
      },
    });

    await userEvent.click(screen.getByTestId('reset-button'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'form/clearDraft',
      payload: Forms.Uncontrolled,
    });
  });

  it('handle reset for HookForm type', async () => {
    renderApp({
      isModalOpen: true,
      modalTitle: 'Test Modal',
      currentFormType: Forms.HookForm,
      draftData: {
        [Forms.Uncontrolled]: null,
        [Forms.HookForm]: { name: 'test' },
      },
    });

    await userEvent.click(screen.getByTestId('reset-button'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'form/clearDraft',
      payload: Forms.HookForm,
    });
  });

  it('not show reset button if modal closed', () => {
    renderApp({
      isModalOpen: false,
      currentFormType: Forms.Uncontrolled,
    });

    expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument();
  });
});
