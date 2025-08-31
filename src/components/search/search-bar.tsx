import styles from '../list/controls.module.scss';
import { useCallback } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search countries...',
}: SearchBarProps) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(event.target.value);
    },
    [onSearchChange]
  );
  return (
    <div className={styles.searchBar}>
      <label htmlFor="search-input" className={styles.label}>
        Search:
      </label>
      <input
        id="search-input"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
