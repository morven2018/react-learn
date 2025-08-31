import React, { memo, useCallback } from 'react';
import styles from './column-selector.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { DataColumn } from '../../shared/types/types';

import {
  resetColumns,
  toggleColumn,
  isColumnMandatory,
} from '../../redux/slice/column-slice';

interface ColumnSelectorProps {
  availableColumns: DataColumn[];
}

const ColumnSelector: React.FC<ColumnSelectorProps> = memo(
  ({ availableColumns }: ColumnSelectorProps) => {
    const dispatch = useAppDispatch();
    const selectedColumns = useAppSelector(selectSelectedColumns);

    const getColumnLabel = useCallback((column: DataColumn): string => {
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
    }, []);

    const handleColumnToggle = useCallback(
      (column: DataColumn) => {
        if (!isColumnMandatory(column)) {
          dispatch(toggleColumn(column));
        }
      },
      [dispatch]
    );

    const handleReset = useCallback(() => {
      dispatch(resetColumns());
    }, [dispatch]);

    const renderedColumns = useCallback(() => {
      return availableColumns.map((column) => {
        const mandatory = isColumnMandatory(column);
        const checked = selectedColumns.includes(column);

        return (
          <label
            key={column}
            className={`${styles.checkboxLabel} ${mandatory ? styles.mandatory : ''}`}
            title={mandatory ? 'This column is required' : ''}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleColumnToggle(column)}
              className={styles.checkbox}
              aria-label={`Toggle ${getColumnLabel(column)} column`}
              disabled={mandatory}
            />
            <span className={styles.checkmark}></span>
            {getColumnLabel(column)}
            {mandatory && (
              <span className={styles.requiredBadge}>Required</span>
            )}
          </label>
        );
      });
    }, [availableColumns, selectedColumns, handleColumnToggle, getColumnLabel]);

    return (
      <div className={styles.widget}>
        <div className={styles.content}>
          <div className={styles.actions}>
            <button onClick={handleReset} className={styles.resetButton}>
              Reset to Default
            </button>
          </div>

          <div className={styles.columnsList}>{renderedColumns()}</div>
        </div>
      </div>
    );
  }
);

ColumnSelector.displayName = 'ColumnSelector';

export default ColumnSelector;
