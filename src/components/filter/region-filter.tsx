import React, { useCallback, useMemo } from 'react';
import styles from '../list/controls.module.scss';
import { getAllRegions } from '../../shared/utils/get-region';

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = React.memo(
  ({ selectedRegion, onRegionChange }: RegionFilterProps) => {
    const regions = useMemo(() => ['All', ...getAllRegions()], []);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        onRegionChange(event.target.value);
      },
      [onRegionChange]
    );

    return (
      <div className={styles.regionFilter}>
        <label htmlFor="region-select" className={styles.label}>
          Filter by Region:
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={handleChange}
          className={styles.regionSelect}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

RegionFilter.displayName = 'RegionFilter';

export default RegionFilter;
