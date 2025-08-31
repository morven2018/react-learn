import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectColumnsState = (state: RootState) => state.columns;

export const selectSelectedColumns = createSelector(
  selectColumnsState,
  (columnsState) => columnsState.selectedColumns
);
