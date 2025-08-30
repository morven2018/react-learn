import { SortDirection, SortOption } from '../slice/sort-slice';
import { RootState } from '../store';

export const selectSortBy = (state: RootState): SortOption => state.sort.sortBy;
export const selectSortDirection = (state: RootState): SortDirection =>
  state.sort.sortDirection;
export const selectSortState = (state: RootState) => state.sort;
