import { RootState } from '../store';

export const selectSelectedColumns = (state: RootState) =>
  state.columns.selectedColumns;

export const selectIsColumnSelectorOpen = (state: RootState) =>
  state.columns.isColumnSelectorOpen;

export const selectColumnSelection = (state: RootState) => state.columns;
