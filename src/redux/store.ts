import charactersSlice from '@shared/features/characters-slice';
import { configureStore } from '@reduxjs/toolkit';
import { characterApi } from '@services/api/character-api';

import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    characters: charactersSlice,
    [characterApi.reducerPath]: characterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(characterApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
