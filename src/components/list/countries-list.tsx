import CountryTable from '../table/table';
import styles from './countries-list.module.scss';
import { CO2Data, Country } from '../../shared/types/types';

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryKey: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries,
  onCountrySelect,
  selectedCountry,
  data,
}) => {
  return (
    <div className={styles.list}>
      {countries.map((country) => (
        <div key={country.name} className={styles.countryItem}>
          <div
            className={`${styles.accordionHeader} ${
              selectedCountry === country.name ? styles.selected : ''
            }`}
            onClick={() =>
              onCountrySelect(
                selectedCountry === country.name ? '' : country.name
              )
            }
          >
            <div className={styles.countryInfo}>
              <div className={styles.countryName}>{country.name}</div>
              <div className={styles.countryDetails}>
                {country.iso_code && `ISO: ${country.iso_code}`}
              </div>
              <div className={styles.countryDetails}>
                {country.population &&
                  `Population: ${country.population.toLocaleString()}`}
              </div>
            </div>
            <span className={styles.accordionIcon}>
              {selectedCountry === country.name ? '-' : '+'}
            </span>
          </div>

          {selectedCountry === country.name && (
            <div className={styles.accordionContent}>
              <CountryTable data={data[country.name]?.data || []} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountriesList;
