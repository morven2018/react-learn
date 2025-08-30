import CountryTable from '../table/table';
import formatValue from '../../shared/utils/format-value';
import styles from './countries-list.module.scss';
import { useRef } from 'react';
import { CO2Data, Country, DataColumn } from '../../shared/types/types';

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
  selectedColumns: DataColumn[];
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries,
  onCountrySelect,
  selectedCountry,
  data,
  selectedColumns,
}) => {
  const countryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleCountrySelect = (countryName: string) => {
    const isOpening = selectedCountry !== countryName;
    onCountrySelect(isOpening ? countryName : '');

    if (isOpening && countryRefs.current[countryName]) {
      setTimeout(() => {
        countryRefs.current[countryName]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  const handleHideTable = (countryName: string) => {
    onCountrySelect('');
    setTimeout(() => {
      countryRefs.current[countryName]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const setCountryRef =
    (countryName: string) => (el: HTMLDivElement | null) => {
      countryRefs.current[countryName] = el;
    };

  return (
    <div className={styles.list}>
      {countries.map((country) => {
        const countryData = data[country.name]?.data || [];
        const sortedData = [...countryData].sort((a, b) => b.year - a.year);
        const previewData = sortedData.slice(0, 5);
        const hasMoreData = countryData.length > 5;
        const hasData = countryData.length > 0;

        return (
          <div
            key={country.name}
            className={styles.countryItem}
            ref={setCountryRef(country.name)}
          >
            <div
              className={`${styles.accordionHeader} ${
                selectedCountry === country.name ? styles.selected : ''
              }`}
              onClick={() => handleCountrySelect(country.name)}
            >
              <div className={styles.countryInfo}>
                <div className={styles.countryName}>{country.name}</div>
                <div className={styles.countryDetails}>
                  {`ISO: ${country.iso_code}`}
                </div>
                <div className={styles.countryDetails}>
                  {`Population: ${formatValue(country.population)}`}
                </div>
              </div>
              <span className={styles.accordionIcon}>
                {selectedCountry === country.name ? '-' : '+'}
              </span>
            </div>

            {selectedCountry !== country.name && hasData && (
              <div className={styles.previewContent}>
                <CountryTable data={previewData} columns={selectedColumns} />

                {hasMoreData && (
                  <div className={styles.moreButton}>
                    <button onClick={() => handleCountrySelect(country.name)}>
                      More
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedCountry === country.name && hasData && (
              <div className={styles.fullContent}>
                <CountryTable data={sortedData} columns={selectedColumns} />

                <div className={styles.hideButton}>
                  <button onClick={() => handleHideTable(country.name)}>
                    Hide
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CountriesList;
