import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  onboardingComplete: boolean;
  biometricLoggedIn: boolean;
  biometricEnabled: boolean;
  isFirstLaunch: boolean;
  address: string;
  token: string;
  _id: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  onboardingComplete: false,
  biometricLoggedIn: false,
  biometricEnabled: true,
  isFirstLaunch: false,
  address: '',
  token: '',
  _id: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.onboardingComplete = action.payload;
    },
    setBiometricLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.biometricLoggedIn = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setIsFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setID: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
  },
});

export const {
  setLoggedIn,
  setOnboardingComplete,
  setBiometricLoggedIn,
  setBiometricEnabled,
  setIsFirstLaunch,
  setAddress,
  setToken,
  setID,
} = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const authReducer = authSlice.reducer;
