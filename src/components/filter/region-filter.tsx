import styles from './region-filter.module.scss';
import { getAllRegions } from '../../shared/utils/get-region';

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({
  selectedRegion,
  onRegionChange,
}) => {
  const regions = ['All', ...getAllRegions()];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onRegionChange(event.target.value);
  };

  return (
    <div className={styles.regionFilter}>
      <label htmlFor="region-select">Filter by Region:</label>
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
};

export default RegionFilter;
