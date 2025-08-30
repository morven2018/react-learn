import formatValue from '../../shared/utils/format-value';
import styles from './table.module.scss';
import { DataColumn, YearlyData } from '../../shared/types/types';

interface CountryTableProps {
  data: YearlyData[];
  columns: DataColumn[];
}

const CountryTable: React.FC<CountryTableProps> = ({ data, columns }) => {
  const sortedData = [...data].sort((a, b) => b.year - a.year);

  const getColumnHeader = (column: DataColumn): string => {
    const headers: Record<DataColumn, string> = {
      [DataColumn.YEAR]: 'Year',
      [DataColumn.POPULATION]: 'Population',
      [DataColumn.CO2]: 'CO2 (Mt)',
      [DataColumn.CO2_PER_CAPITA]: 'CO2 per Capita (t)',
      [DataColumn.METHANE]: 'Methane (Mt)',
      [DataColumn.OIL_CO2]: 'Oil CO2 (Mt)',
      [DataColumn.TEMPERATURE_CHANGE_FROM_CO2]: 'Temp Change from CO2 (°C)',
      [DataColumn.CEMENT_CO2]: 'Cement CO2 (Mt)',
      [DataColumn.COAL_CO2]: 'Coal CO2 (Mt)',
      [DataColumn.GAS_CO2]: 'Gas CO2 (Mt)',
      [DataColumn.FLARING_CO2]: 'Flaring CO2 (Mt)',
      [DataColumn.LAND_USE_CHANGE_CO2]: 'Land Use CO2 (Mt)',
      [DataColumn.NITROUS_OXIDE]: 'Nitrous Oxide (Mt)',
      [DataColumn.TOTAL_GHG]: 'Total GHG (Mt)',
    };
    return headers[column] || column;
  };

  const shouldRightAlign = (column: DataColumn): boolean => {
    return column !== DataColumn.YEAR;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                className={shouldRightAlign(column) ? styles.rightAlign : ''}
              >
                {index === 0 ? column : getColumnHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((yearData, index) => (
            <tr key={`${yearData.year}-${index}`}>
              {columns.map((column) => (
                <td
                  key={column}
                  className={shouldRightAlign(column) ? styles.rightAlign : ''}
                >
                  {formatValue(yearData[column], column === DataColumn.YEAR)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryTable;
