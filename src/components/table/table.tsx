import formatValue from '../../shared/utils/format-value';
import getLabel from '../../shared/utils/column-labels';
import styles from './table.module.scss';
import { DataColumn, YearlyData } from '../../shared/types/types';

interface CountryTableProps {
  data: YearlyData[];
  columns: DataColumn[];
}

const CountryTable: React.FC<CountryTableProps> = ({
  data,
  columns,
}: CountryTableProps) => {
  const sortedData = [...data].sort((a, b) => b.year - a.year);

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
                {index === 0 ? column : getLabel(column)}
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
