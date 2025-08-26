import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  lastSearchTerm: string;
}

const initialState: SearchState = {
  lastSearchTerm: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLastSearchTerm: (state, action: PayloadAction<string>) => {
      state.lastSearchTerm = action.payload;
    },
  },
});

export const { setLastSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
