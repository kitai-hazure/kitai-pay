import * as LocalAuthentication from 'expo-local-authentication';

export const loginBiometric = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return false;
  }
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Please authenticate to proceed',
    fallbackLabel: 'Use your passcode',
  });
  return result.success;
};
