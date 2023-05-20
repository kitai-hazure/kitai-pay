import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomBottomModalSheet from '../components/CustomBottomModalSheet';
import WalletAddressWrapper from '../components/WalletAddressWrapper';
import { useSecureRoute } from '../hooks';
// import { StackNavigationProps } from 'src/helpers';
import { StackNavigationProps } from '../helpers';
import { MainNavigatorParamList } from '../navigation';
import QRCodeShadow from './shadows/QRCodeShadow';

interface IQRData {
  to: string;
  amount: number | null;
  token: string;
}

type QRCodeScreenProps = StackNavigationProps<
  MainNavigatorParamList,
  'QRCODESCAN'
>;

const QRCodeScreen = ({ navigation }: QRCodeScreenProps) => {
  const start = useSecureRoute(navigation);
  const [openSheet, setOpenSheet] = React.useState(false);
  const [qrData, setQRData] = React.useState<IQRData[]>([]);

  const onSuccess = (e: any) => {
    console.log('QR Code: ', e.data);
    // expect data like this
    const TEMP_TEST_DATA = [
      {
        to: '0xd69c42670211857a1c4DE08633FB411C80056989',
        amount: 0.2,
        token: 'ETH',
      },
    ];
    setQRData(TEMP_TEST_DATA);
    setOpenSheet(true);
  };

  if (!start) {
    return <QRCodeShadow />;
  }

  return !openSheet ? (
    <QRCodeScanner onRead={onSuccess} />
  ) : (
    <View style={styles.externalContainer}>
      <CustomBottomModalSheet
        snapPoints={['25%', '50%', '90%']}
        handleSheetChanges={index => console.log(index)}>
        <View style={styles.walletUltraWrapper}>
          <Text style={styles.textKeyStyle}>To</Text>
          <WalletAddressWrapper walletAddress={qrData[0].to} />
        </View>
      </CustomBottomModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  walletUltraWrapper: {
    marginHorizontal: 20,
  },
  arrowWrapper: {
    alignItems: 'center',
    marginVertical: 5,
  },
  textKeyStyle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
export default QRCodeScreen;
