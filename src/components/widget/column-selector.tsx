import styles from './column-selector.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { DataColumn } from '../../shared/types/types';

import {
  selectIsColumnSelectorOpen,
  selectSelectedColumns,
} from '../../redux/selectors/column-selectors';
import {
  closeColumnSelector,
  resetColumns,
  toggleColumn,
} from '../../redux/slice/column-slice';

interface ColumnSelectorProps {
  availableColumns: DataColumn[];
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  availableColumns,
}) => {
  const dispatch = useAppDispatch();
  const isColumnSelectorOpen = useAppSelector(selectIsColumnSelectorOpen);
  const selectedColumns = useAppSelector(selectSelectedColumns);

  if (!isColumnSelectorOpen) return null;

  const getColumnLabel = (column: DataColumn): string => {
    const labels: Record<DataColumn, string> = {
      [DataColumn.YEAR]: 'Year',
      [DataColumn.POPULATION]: 'Population',
      [DataColumn.CO2]: 'CO2 Emissions',
      [DataColumn.CO2_PER_CAPITA]: 'CO2 per Capita',
      [DataColumn.METHANE]: 'Methane Emissions',
      [DataColumn.OIL_CO2]: 'Oil CO2 Emissions',
      [DataColumn.TEMPERATURE_CHANGE_FROM_CO2]: 'Temperature Change from CO2',
      [DataColumn.CEMENT_CO2]: 'Cement CO2',
      [DataColumn.COAL_CO2]: 'Coal CO2',
      [DataColumn.GAS_CO2]: 'Gas CO2',
      [DataColumn.FLARING_CO2]: 'Flaring CO2',
      [DataColumn.LAND_USE_CHANGE_CO2]: 'Land Use Change CO2',
      [DataColumn.NITROUS_OXIDE]: 'Nitrous Oxide',
      [DataColumn.TOTAL_GHG]: 'Total GHG',
    };
    return labels[column] || column;
  };

  const handleClose = () => {
    dispatch(closeColumnSelector());
  };

  const handleColumnToggle = (column: DataColumn) => {
    dispatch(toggleColumn(column));
  };

  const handleReset = () => {
    dispatch(resetColumns());
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Select Columns to Display</h3>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close column selector"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.actions}>
            <button onClick={handleReset} className={styles.resetButton}>
              Reset to Default
            </button>
          </div>

          <div className={styles.columnsList}>
            {availableColumns.map((column) => (
              <label key={column} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                  className={styles.checkbox}
                  aria-label={`Toggle ${getColumnLabel(column)} column`}
                />
                <span className={styles.checkmark}></span>
                {getColumnLabel(column)}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.doneButton}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnSelector;
