import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ICustomWalletWrapperProps {
  walletAddress: string;
}

const WalletAddressWrapper = ({ walletAddress }: ICustomWalletWrapperProps) => {
  return (
    <View style={styles.walletWrapper}>
      <Text style={styles.textStyle}>{walletAddress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  walletWrapper: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  textStyle: {
    fontSize: 12,
    fontWeight: '400',
  },
});
export default WalletAddressWrapper;
