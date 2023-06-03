import { useDispatch } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth';
import { errorReducer } from './error';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type ReduxState = ReturnType<typeof rootReducer>;
