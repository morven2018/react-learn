import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type SortOption = 'name' | 'population';
export type SortDirection = 'asc' | 'desc';

interface SortState {
  sortBy: SortOption;
  sortDirection: SortDirection;
}

const initialState: SortState = {
  sortBy: 'name',
  sortDirection: 'asc',
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    toggleSort: (state, action: PayloadAction<SortOption>) => {
      if (state.sortBy === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortDirection = 'desc';
      }
    },
  },
});

export const { setSortOption, setSortDirection, toggleSort } =
  sortSlice.actions;
export default sortSlice.reducer;
