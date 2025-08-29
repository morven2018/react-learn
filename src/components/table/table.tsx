import formatValue from '../../shared/utils/format-value';
import styles from './table.module.scss';
import { YearlyData } from '../../shared/types/types';

interface CountryTableProps {
  data: YearlyData[];
}

const CountryTable: React.FC<CountryTableProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.year - a.year);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Year</th>
            <th className={styles.rightAlign}>Population</th>
            <th className={styles.rightAlign}>CO2 (Mt)</th>
            <th className={styles.rightAlign}>CO2 per Capita (t)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((yearData, index) => (
            <tr key={`${yearData.year}-${index}`}>
              <td>{yearData.year}</td>
              <td className={styles.rightAlign}>
                {formatValue(yearData.population)}
              </td>
              <td className={styles.rightAlign}>{formatValue(yearData.co2)}</td>
              <td className={styles.rightAlign}>
                {formatValue(yearData.co2_per_capita)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!!data.length && <div className={styles.noData}>No data available</div>}
    </div>
  );
};

export default CountryTable;
