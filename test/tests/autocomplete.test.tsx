import AutocompleteCountry from '../../src/components/autocomplete-country/autocomplete-country';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

const createMockStore = (
  countries: string[] = [
    'United States',
    'Canada',
    'Mexico',
    'United Kingdom',
    'Germany',
  ]
) => {
  return configureStore({
    reducer: {
      countries: () => ({
        list: countries,
      }),
    },
  });
};

describe('AutocompleteCountry', () => {
  const defaultProps = {
    id: 'country',
    name: 'country',
    placeholder: 'Select country',
  };

  const renderWithProvider = (props = {}, countries?: string[]) => {
    const store = createMockStore(countries);
    return render(
      <Provider store={store}>
        <AutocompleteCountry {...defaultProps} {...props} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render input field with correct attributes', () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'country');
    expect(input).toHaveAttribute('name', 'country');
    expect(input).toHaveAttribute('placeholder', 'Select country');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  it('display initial value', () => {
    renderWithProvider({ value: 'Canada' });

    expect(screen.getByDisplayValue('Canada')).toBeInTheDocument();
  });

  it('filter countries based on input', async () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Uni');

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
  });

  it('show dropdown when input is focused and has value', async () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');

    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    await userEvent.click(input);
    await userEvent.type(input, 'C');

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('select country from dropdown', async () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Can');

    const canadaOption = screen.getByText('Canada');
    await userEvent.click(canadaOption);

    expect(input).toHaveValue('Canada');
  });

  it('close dropdown when clicking outside', async () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'C');

    expect(screen.getAllByRole('option')).toHaveLength(2);

    await userEvent.click(document.body);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('show "No countries found" message', async () => {
    renderWithProvider();

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'NonExistentCountry');

    expect(screen.getByText('No countries found')).toBeInTheDocument();
  });

  it('handle empty countries list', async () => {
    renderWithProvider({}, []);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');

    expect(screen.getByText('No countries found')).toBeInTheDocument();
  });

  it('call onChange callback on input change', async () => {
    const handleChange = jest.fn();
    renderWithProvider({ onChange: handleChange });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Ca');

    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith('C');
    expect(handleChange).toHaveBeenCalledWith('Ca');
  });

  it('call onInputChange callback on input change', async () => {
    const handleInputChange = jest.fn();
    renderWithProvider({ onInputChange: handleInputChange });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'C');

    expect(handleInputChange).toHaveBeenCalledTimes(1);
  });

  it('update value when prop changes', () => {
    const { rerender } = renderWithProvider({ value: 'Initial' });

    expect(screen.getByDisplayValue('Initial')).toBeInTheDocument();

    rerender(
      <Provider store={createMockStore()}>
        <AutocompleteCountry {...defaultProps} value="Updated" />
      </Provider>
    );

    expect(screen.getByDisplayValue('Updated')).toBeInTheDocument();
  });
});
