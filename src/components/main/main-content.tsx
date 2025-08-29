import CountriesList from '../list/countries-list';
import isCountry from '../../shared/utils/country-filter';
import { fetchCO2Data } from '../../shared/api/api';
import { CO2Data, Country } from '../../shared/types/types';

const NO_DATA = 'N/A';

const MainContent: React.FC = () => {
  const data = fetchCO2Data();

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

  return <CountriesList countries={countries} />;
};

export default MainContent;
