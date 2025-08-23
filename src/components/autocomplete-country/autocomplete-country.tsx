import style from '../forms/form.module.scss';
import { useAppSelector } from '../../redux/hooks';

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface AutocompleteCountryProps {
  id: string;
  name: string;
  placeholder?: string;
  onInputChange?: () => void;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface AutocompleteCountryRef {
  value: string;
  focus: () => void;
}

const AutocompleteCountry = forwardRef<
  AutocompleteCountryRef,
  AutocompleteCountryProps
>(({ id, name, placeholder, onInputChange, error, value, onChange }, ref) => {
  const countries = useAppSelector((state) => state.countries.list);
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get value() {
      return inputValue;
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    setFilteredCountries(
      countries.filter((country) =>
        country.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, countries]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange?.(newValue);
    onInputChange?.();
  };

  const handleSelectCountry = (country: string) => {
    setInputValue(country);
    setIsOpen(false);
    onChange?.(country);
    onInputChange?.();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={style.autocompleteWrapper} ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={style.formInput}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-haspopup="true"
      />

      {isOpen && inputValue.length > 0 && (
        <div className={style.autocompleteDropdown}>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <option
                key={country}
                className={style.autocompleteOption}
                onClick={() => handleSelectCountry(country)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectCountry(country);
                  }
                }}
                tabIndex={0}
                aria-selected={inputValue === country}
              >
                {country}
              </option>
            ))
          ) : (
            <div className={style.autocompleteOption}>No countries found</div>
          )}
        </div>
      )}

      {error && <span className={style.error}>{error}</span>}
    </div>
  );
});

AutocompleteCountry.displayName = 'AutocompleteCountry';
export default AutocompleteCountry;
