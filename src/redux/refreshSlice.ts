import { createSlice } from '@reduxjs/toolkit';

interface RefreshState {
  version: number;
}

const initialState: RefreshState = {
  version: 0,
};

export const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    triggerRefresh: (state) => {
      state.version += 1;
    },
  },
});

export const { triggerRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
