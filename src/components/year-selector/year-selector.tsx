import React, { useEffect, useState } from 'react';
import styles from './year-selector.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSelectedYear } from '../../redux/selectors/year-selectors';
import { setYear } from '../../redux/slice/year-slice';

interface YearSelectorProps {
  availableYears: number[];
}

const YearSelector: React.FC<YearSelectorProps> = ({ availableYears }) => {
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector(selectSelectedYear);
  const [localYears, setLocalYears] = useState<number[]>(availableYears);

  useEffect(() => {
    setLocalYears(availableYears);
  }, [availableYears]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value);
    dispatch(setYear(year));
  };

  if (localYears.length === 0) {
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
        {localYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
