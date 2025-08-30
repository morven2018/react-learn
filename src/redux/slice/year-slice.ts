import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface YearState {
  selectedYear: number;
  previousYear: number | null;
}

const initialState: YearState = {
  selectedYear: new Date().getFullYear() - 1,
  previousYear: null,
};

const yearSlice = createSlice({
  name: 'year',
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      state.previousYear = state.selectedYear;
      state.selectedYear = action.payload;
    },
    clearPreviousYear: (state) => {
      state.previousYear = null;
    },
  },
});

export const { setYear, clearPreviousYear } = yearSlice.actions;
export default yearSlice.reducer;
