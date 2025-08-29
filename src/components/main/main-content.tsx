import CountriesList from '../list/countries-list';
import isCountry from '../../shared/utils/is-country';
import styles from './main-content.module.scss';
import { useState } from 'react';
import { fetchCO2Data } from '../../shared/api/api';
import { CO2Data, Country } from '../../shared/types/types';

const NO_DATA = 'N/A';

const MainContent: React.FC = () => {
  const data = fetchCO2Data();
  const [selectedCountryKey, setSelectedCountryKey] = useState<string | null>(
    null
  );

  const getCountries = (data: CO2Data): Country[] => {
    const countries: Country[] = [];

    for (const [key, countryData] of Object.entries(data)) {
      if (isCountry(key)) {
        const latestData = countryData.data[countryData.data.length - 1];

        countries.push({
          name: key,
          iso_code: countryData.iso_code ?? NO_DATA,
          population: latestData?.population ?? NO_DATA,
        });
      }
    }

    return countries;
  };

  const countries = getCountries(data);
  const handleCountrySelect = (countryKey: string) => {
    setSelectedCountryKey(
      countryKey === selectedCountryKey ? null : countryKey
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <CountriesList
          countries={countries}
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountryKey}
          data={data}
        />
      </div>
    </div>
  );
};

export default MainContent;
