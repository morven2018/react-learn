import { createSlice } from '@reduxjs/toolkit';
import { countries } from '../../shared/constants/countries';

interface CountryState {
  list: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  list: countries,
  loading: false,
  error: null,
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCountries: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCountries, setLoading, setError } = countrySlice.actions;
export default countrySlice.reducer;
