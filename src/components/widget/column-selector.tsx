import React, { memo, useCallback, useState } from 'react';
import getLabel from '../../shared/utils/column-labels';
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
    const [isExpanded, setIsExpanded] = useState(false);

    const getColumnLabel = useCallback(
      (column: DataColumn): string => getLabel(column),
      []
    );

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

    const toggleExpanded = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

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
      <div
        className={`${styles.widget} ${!isExpanded ? styles.collapsed : styles.open}`}
      >
        <div className={styles.controls}>
          {isExpanded && (
            <button onClick={handleReset} className={styles.resetButton}>
              Reset
            </button>
          )}
          <button onClick={toggleExpanded} className={styles.toggleButton}>
            {isExpanded ? 'Close' : 'Select Columns'}
          </button>
        </div>
        {isExpanded && (
          <div className={styles.columnsList}>{renderedColumns()}</div>
        )}
      </div>
    );
  }
);

ColumnSelector.displayName = 'ColumnSelector';

export default ColumnSelector;
