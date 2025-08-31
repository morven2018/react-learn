import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectYearState = (state: RootState) => state.year;

export const selectSelectedYear = createSelector(
  selectYearState,
  (yearState) => yearState.selectedYear
);

export const selectPreviousYear = createSelector(
  selectYearState,
  (yearState) => yearState.previousYear
);

export const selectShouldHighlight = createSelector(
  selectYearState,
  (yearState) => yearState.previousYear !== null
);
