import style from '../forms/form.module.scss';
import { useAppSelector } from '../../redux/hooks';

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
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
  setValue: (value: string) => void;
  focus: () => void;
}

const AutocompleteCountry = forwardRef<
  AutocompleteCountryRef,
  AutocompleteCountryProps
>(({ id, name, placeholder, onInputChange, error, value, onChange }, ref) => {
  const countries = useAppSelector((state) => state.countries.list);
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, countries]);

  useImperativeHandle(ref, () => ({
    get value() {
      return inputValue;
    },
    setValue: (newValue: string) => {
      setInputValue(newValue);
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

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
    setActiveIndex(0);
    onChange?.(newValue);
    onInputChange?.();
  };

  const handleSelectCountry = (country: string) => {
    setInputValue(country);
    setIsOpen(false);
    onChange?.(country);
    onInputChange?.();
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          Math.min(prev + 1, filteredCountries.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCountries[activeIndex]) {
          handleSelectCountry(filteredCountries[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.focus();
        break;
    }
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current && activeIndex >= 0) {
      const activeItem = dropdownRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

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
        onKeyDown={handleKeyDown}
        className={`${style.formInput} ${error ? style.inputError : ''}`}
        placeholder={placeholder}
        autoComplete="off"
      />

      {isOpen && inputValue.length > 0 && (
        <div
          ref={dropdownRef}
          id={`${id}-dropdown`}
          className={style.autocompleteDropdown}
          role="listbox"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <option
                key={country}
                className={`${style.autocompleteOption} ${
                  index === activeIndex ? style.activeOption : ''
                }`}
                onClick={() => handleSelectCountry(country)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectCountry(country);
                  }
                }}
                aria-selected={inputValue === country}
                tabIndex={0}
              >
                {country}
              </option>
            ))
          ) : (
            <option className={style.autocompleteOption}>
              No countries found
            </option>
          )}
        </div>
      )}

      {error && <span className={style.error}>{error}</span>}
    </div>
  );
});

AutocompleteCountry.displayName = 'AutocompleteCountry';
export default AutocompleteCountry;
