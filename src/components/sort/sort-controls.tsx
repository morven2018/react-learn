import styles from './sort-controls.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { SortOption, toggleSort } from '../../redux/slice/sort-slice';

import {
  selectSortBy,
  selectSortDirection,
} from '../../redux/selectors/sort-selectors';

const SortControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);

  const handleSortChange = (option: SortOption) => {
    dispatch(toggleSort(option));
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return '↓';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.sortControls}>
      <span className={styles.sortLabel}>Sort by:</span>

      <button
        className={`${styles.sortButton} ${sortBy === 'name' ? styles.active : ''}`}
        onClick={() => handleSortChange('name')}
      >
        Name {getSortIcon('name')}
      </button>

      <button
        className={`${styles.sortButton} ${sortBy === 'population' ? styles.active : ''}`}
        onClick={() => handleSortChange('population')}
      >
        Population {getSortIcon('population')}
      </button>
    </div>
  );
};

export default SortControls;
