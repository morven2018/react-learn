import ColumnSelector from '../widget/column-selector';
import CountriesList from '../list/countries-list';
import CountryTable from '../table/table';
import isCountry from '../../shared/utils/is-country';
import styles from './main-content.module.scss';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { openColumnSelector } from '../../redux/slice/column-slice';
import { fetchCO2Data } from '../../shared/api/api';
import { CO2Data, Country, DataColumn } from '../../shared/types/types';

const NO_DATA = 'N/A';

const MainContent: React.FC = () => {
  const data = fetchCO2Data();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const selectedColumns = useAppSelector(selectSelectedColumns);

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
  const yearlyData = selectedCountry ? data[selectedCountry]?.data || [] : [];

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName === selectedCountry ? null : countryName);
  };

  const handleOpenColumnSelector = () => {
    dispatch(openColumnSelector());
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Countries ({countries.length})</h2>
        <CountriesList
          countries={countries}
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountry}
          data={data}
          selectedColumns={selectedColumns}
        />
      </div>

      <div className={styles.content}>
        <div>
          <div className={styles.tableHeader}>
            <button
              onClick={handleOpenColumnSelector}
              className={styles.columnButton}
            >
              Select Columns
            </button>
          </div>
        </div>
      </div>

      <ColumnSelector availableColumns={availableColumns} />
    </div>
  );
};

export default MainContent;
