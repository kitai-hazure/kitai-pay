import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRCodeScreen = () => {
  const onSuccess = (e: any) => {
    // DS -> [{to, amount, tokenAddress}]
    console.log('QR Code: ', e.data);
  };

  return <QRCodeScanner onRead={onSuccess} />;
};

export default QRCodeScreen;
