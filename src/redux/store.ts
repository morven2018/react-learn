import columnReducer from './slice/column-slice';
import yearReducer from './slice/year-slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    columns: columnReducer,
    year: yearReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
