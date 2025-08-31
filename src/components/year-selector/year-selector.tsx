import React, { useCallback } from 'react';
import styles from './year-selector.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSelectedYear } from '../../redux/selectors/year-selectors';
import { setYear } from '../../redux/slice/year-slice';

interface YearSelectorProps {
  availableYears: number[];
}

const YearSelector: React.FC<YearSelectorProps> = React.memo(
  ({ availableYears }) => {
    const dispatch = useAppDispatch();
    const selectedYear = useAppSelector(selectSelectedYear);

    const handleYearChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(event.target.value);
        dispatch(setYear(year));
      },
      [dispatch]
    );

    if (availableYears.length === 0) {
      return null;
    }

    return (
      <div className={styles.yearSelector}>
        <label htmlFor="year-select" className={styles.label}>
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className={styles.select}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

YearSelector.displayName = 'YearSelector';

export default YearSelector;
