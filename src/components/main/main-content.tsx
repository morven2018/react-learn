import ColumnSelector from '../widget/column-selector';
import CountriesList from '../list/countries-list';
import YearSelector from '../year-selector/year-selector';
import isCountry from '../../shared/utils/is-country';
import styles from './main-content.module.scss';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { selectSelectedYear } from '../../redux/selectors/year-selectors';
import { fetchCO2Data } from '../../shared/api/api';
import { CO2Data, Country, DataColumn } from '../../shared/types/types';

const NO_DATA = 'N/A';

const MainContent: React.FC = () => {
  const data = fetchCO2Data();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const selectedColumns = useAppSelector(selectSelectedColumns);
  const selectedYear = useAppSelector(selectSelectedYear);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    Object.values(data).forEach((countryData) => {
      countryData.data.forEach((yearData) => {
        years.add(yearData.year);
      });
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data]);

  const getCountries = (data: CO2Data): Country[] => {
    const countries: Country[] = [];

    for (const [key, countryData] of Object.entries(data)) {
      if (isCountry(key)) {
        const yearData = countryData.data.find((d) => d.year === selectedYear);

        countries.push({
          name: key,
          iso_code: countryData.iso_code ?? NO_DATA,
          population: yearData?.population ?? NO_DATA,
        });
      }
    }

    return countries;
  };

  const getAvailableColumns = (): DataColumn[] => {
    return [
      DataColumn.YEAR,
      DataColumn.POPULATION,
      DataColumn.CO2,
      DataColumn.CO2_PER_CAPITA,
      DataColumn.METHANE,
      DataColumn.OIL_CO2,
      DataColumn.TEMPERATURE_CHANGE_FROM_CO2,
      DataColumn.CEMENT_CO2,
      DataColumn.COAL_CO2,
      DataColumn.GAS_CO2,
      DataColumn.FLARING_CO2,
      DataColumn.LAND_USE_CHANGE_CO2,
      DataColumn.NITROUS_OXIDE,
      DataColumn.TOTAL_GHG,
    ];
  };

  const countries = getCountries(data);
  const availableColumns = getAvailableColumns();
  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName === selectedCountry ? null : countryName);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <YearSelector availableYears={availableYears} />
      </div>
      <div className={styles.sidebar}>
        <h2>Countries ({countries.length})</h2>
        <CountriesList
          countries={countries}
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountry}
          data={data}
          selectedColumns={selectedColumns}
          selectedYear={selectedYear}
        />
      </div>

      <div className={styles.columnSelectorWidget}>
        <ColumnSelector availableColumns={availableColumns} />
      </div>
    </div>
  );
};

export default MainContent;
