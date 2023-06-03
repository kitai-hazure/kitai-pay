import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
}

const initialState: ErrorState = {
  hasError: false,
  errorMessage: undefined,
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorState>) => {
      state.hasError = action.payload.hasError;
      state.errorMessage = action.payload.errorMessage;
    },
    clearError: state => {
      state.hasError = false;
      state.errorMessage = undefined;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export const selectErrorState = (state: { error: ErrorState }) => state.error;

export const errorReducer = errorSlice.reducer;
