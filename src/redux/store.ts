import columnReducer from './slice/column-slice';
import sortReducer from './slice/sort-slice';
import yearReducer from './slice/year-slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    columns: columnReducer,
    year: yearReducer,
    sort: sortReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
