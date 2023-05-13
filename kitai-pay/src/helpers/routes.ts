import { ROUTES } from '../constants';
import { AuthState } from '../redux';

export const getInitialRoute = (auth: AuthState) => {
  const { isLoggedIn, biometricEnabled, biometricLoggedIn } = auth;
  if (
    isLoggedIn &&
    ((biometricEnabled && biometricLoggedIn) || !biometricEnabled)
  ) {
    return ROUTES.MAIN;
  } else if (isLoggedIn && biometricEnabled && !biometricLoggedIn) {
    return ROUTES.BIOMETRIC;
  } else {
    return ROUTES.ONBOARDING;
  }
};
