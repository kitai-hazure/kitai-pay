import React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProps, navigate, shortenedAddress } from '../helpers';
import { handleNotification } from '../components/Notification';
import { MainNavigatorParamList } from '../navigation';
import useSecureRoute from '../hooks/useSecureRoute';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import DashboardShadow from './shadows/DashboardShadow';
import { ROUTES, COLORS } from '../constants';
import AnimatedLottieView from 'lottie-react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

type DashboardProps = StackNavigationProps<MainNavigatorParamList, 'DASHBOARD'>;

const Dashboard = ({ navigation }: DashboardProps) => {
  const start = useSecureRoute(navigation);
  const { address } = useSelector(selectAuthState);
  const shortAddress = shortenedAddress(address);
  console.log('shortAddress', shortAddress);

  const navigateToCreatePayment = () => {
    navigate({ navigation, routeName: ROUTES.CREATE_PAYMENT });
  };
  const navigateToScanQRCode = () => {
    navigate({ navigation, routeName: ROUTES.QRCODESCAN });
  };

  if (!start) {
    return <DashboardShadow />;
  }

  const dashboardItems = [
    {
      icon: 'create-outline',
      type: 'Ionicons',
      title: 'Create Payment',
      onClick: () => navigateToCreatePayment(),
    },
    {
      icon: 'qr-code-outline',
      type: 'Ionicons',
      title: 'Scan QR Code',
      onClick: () => navigateToScanQRCode(),
    },
    {
      icon: 'image-outline',
      type: 'Ionicons',
      title: 'My NFTs',
      onClick: () => {},
    },
    {
      icon: 'history',
      type: 'FontAwesome5',
      title: 'Payment History',
      onClick: () => {},
    },
    {
      icon: 'settings-outline',
      type: 'Ionicons',
      title: 'Settings',
      onClick: () => {},
    },
    {
      icon: 'money-check',
      type: 'FontAwesome5',
      title: 'My Assets',
      onClick: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <AnimatedLottieView
          source={require('../assets/animations/avatar.json')}
          autoPlay
          loop
          style={styles.avatarLottie}
        />
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.accountAddress}>{shortAddress}</Text>
        </View>
      </View>
      <View style={styles.iconWrapper}>
        {dashboardItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconContainer}
            onPress={item.onClick}>
            {item.type === 'Ionicons' ? (
              <Ionicons name={item.icon as any} size={30} color="white" />
            ) : (
              <FontAwesome5 name={item.icon} size={30} color="white" />
            )}
            <Text style={styles.iconText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title="NOTIFY ME"
        onPress={() => handleNotification('TITLE', 'HEYLOO')}
      />
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  cardContainer: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GREY,
    shadowColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAddress: {
    fontSize: 16,
    color: COLORS.WHITE,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.WHITE,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  avatarLottie: {
    width: 100,
    height: 100,
  },
  iconWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GREY,
    shadowColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
  },
  iconText: {
    color: COLORS.WHITE,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
