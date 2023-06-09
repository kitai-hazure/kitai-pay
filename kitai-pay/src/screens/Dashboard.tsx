import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProps, navigate, shortenedAddress } from '../helpers';
import { MainNavigatorParamList } from '../navigation';
import useSecureRoute from '../hooks/useSecureRoute';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import DashboardShadow from './shadows/DashboardShadow';
import { ROUTES, COLORS, CHAIN_DETAILS } from '../constants';
import AnimatedLottieView from 'lottie-react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export const getDisplayAmount = (amount: string) => {
  const newAmount = parseInt(amount, 10) / 1e18;
  return newAmount.toFixed(5);
};

interface GasDetails {
  average: string;
  baseFee?: string;
  high: string;
  lastBlock: string;
  low: string;
}

type DashboardProps = StackNavigationProps<MainNavigatorParamList, 'DASHBOARD'>;

const Dashboard = ({ navigation }: DashboardProps) => {
  const start = useSecureRoute(navigation);
  const { address } = useSelector(selectAuthState);
  const shortAddress = shortenedAddress(address);
  console.log('shortAddress', shortAddress);
  const [gasDetails, setGasDetails] = React.useState<GasDetails>();
  const [amount, setAmount] = React.useState<string>();

  const getGasPrice = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoYkg5RmlFMkZfcEFSY2RWeWxGaHNtVVY1blZfOEVGYXN4VlVyajVtRU9JIn0.eyJleHAiOjE2ODY0MTg4MDksImlhdCI6MTY4NTgxNDAwOSwianRpIjoiZGNjYjA2ZGYtOWM1NS00MjZhLTgyZGYtNGI5ZWM2MWExNGFjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmx1bml2ZXJzZS5jb206MzEwMC9yZWFsbXMvbm92YSIsInN1YiI6ImViNWNmODUxLTViYmUtNGUxMi04OGExLWUyOGI4N2JmYjZiMSIsInR5cCI6IkJlYXJlciIsImF6cCI6IjE2ODU4MTM1OTU2MzU5OTk0MzIiLCJzZXNzaW9uX3N0YXRlIjoiYzIzY2M3ZjMtYWViZi00ODMwLWFiNTYtZTZhZjkwYzE1MGYwIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5vdmEiXX0sInNjb3BlIjoicHJvZmlsZSIsInNpZCI6ImMyM2NjN2YzLWFlYmYtNDgzMC1hYjU2LWU2YWY5MGMxNTBmMCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE2ODU4MTM1OTU2MzU5OTk0MzI6N3l4a2ViZTh0Ympqdnkya2p3YmJuZGpkajZ2ZzJtN2poNmJnZmlsdGE3dmtkeTQza3premFrbXh2NjZwaG1xdSIsImdyYW50Ijp7InByb3RvY29scyI6IjIiLCJhY2NvdW50cyI6IjIiLCJibG9ja3MiOiIyIiwidHJhbnNhY3Rpb25zIjoiMiIsImFzc2V0cyI6IjIiLCJldmVudHMiOiIyIiwic3RhdHMiOiIyIiwid2ViaG9va3MiOiIyIn19.I1uJlgR2Nhewjae4CMhn6pSvJPXNecHULwolJZpVtLyAwLNK8XCPSx4KtEEwzkNp65lx9bl_b45-MW0Jio3qokoYecD5ihia7PjzssCiXKoxjZFVKWIB8VXY6Wj_oqbnfLxxcYghNJmlZdKy0jJQDnaCS7ukapkoEiV6M4gbO2azn7jqJ3X1laDEilLaYZ3iduoS5wPk-2AcRUTwbgtSj_DO5Il9o3hTjVsftj9YxfWmeC7Xwj8pLvDNgC-jK9wQQ0eTZ7DdRpbVh1kygNq650nyx0RDRie0qvCq21ahYJlGwE5ZnZOLqegZ81W-GKojBHUHkRsgJMRfwcy90J_uzg',
      },
    };

    fetch(
      'https://web3.luniverse.io/v1/polygon/mumbai/transactions/gas/price',
      options,
    )
      .then(response => response.json())
      .then(response => setGasDetails(response.data))
      .catch(err => console.error(err));
  };

  const getAmount = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoYkg5RmlFMkZfcEFSY2RWeWxGaHNtVVY1blZfOEVGYXN4VlVyajVtRU9JIn0.eyJleHAiOjE2ODY0MTg4MDksImlhdCI6MTY4NTgxNDAwOSwianRpIjoiZGNjYjA2ZGYtOWM1NS00MjZhLTgyZGYtNGI5ZWM2MWExNGFjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmx1bml2ZXJzZS5jb206MzEwMC9yZWFsbXMvbm92YSIsInN1YiI6ImViNWNmODUxLTViYmUtNGUxMi04OGExLWUyOGI4N2JmYjZiMSIsInR5cCI6IkJlYXJlciIsImF6cCI6IjE2ODU4MTM1OTU2MzU5OTk0MzIiLCJzZXNzaW9uX3N0YXRlIjoiYzIzY2M3ZjMtYWViZi00ODMwLWFiNTYtZTZhZjkwYzE1MGYwIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5vdmEiXX0sInNjb3BlIjoicHJvZmlsZSIsInNpZCI6ImMyM2NjN2YzLWFlYmYtNDgzMC1hYjU2LWU2YWY5MGMxNTBmMCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE2ODU4MTM1OTU2MzU5OTk0MzI6N3l4a2ViZTh0Ympqdnkya2p3YmJuZGpkajZ2ZzJtN2poNmJnZmlsdGE3dmtkeTQza3premFrbXh2NjZwaG1xdSIsImdyYW50Ijp7InByb3RvY29scyI6IjIiLCJhY2NvdW50cyI6IjIiLCJibG9ja3MiOiIyIiwidHJhbnNhY3Rpb25zIjoiMiIsImFzc2V0cyI6IjIiLCJldmVudHMiOiIyIiwic3RhdHMiOiIyIiwid2ViaG9va3MiOiIyIn19.I1uJlgR2Nhewjae4CMhn6pSvJPXNecHULwolJZpVtLyAwLNK8XCPSx4KtEEwzkNp65lx9bl_b45-MW0Jio3qokoYecD5ihia7PjzssCiXKoxjZFVKWIB8VXY6Wj_oqbnfLxxcYghNJmlZdKy0jJQDnaCS7ukapkoEiV6M4gbO2azn7jqJ3X1laDEilLaYZ3iduoS5wPk-2AcRUTwbgtSj_DO5Il9o3hTjVsftj9YxfWmeC7Xwj8pLvDNgC-jK9wQQ0eTZ7DdRpbVh1kygNq650nyx0RDRie0qvCq21ahYJlGwE5ZnZOLqegZ81W-GKojBHUHkRsgJMRfwcy90J_uzg',
      },
    };

    fetch(
      'https://web3.luniverse.io/v1/polygon/mumbai/accounts/0xACEe0D180d0118FD4F3027Ab801cc862520570d1/balance?page=1&rpp=20',
      options,
    )
      .then(response => response.json())
      .then(response => setAmount(response.data.items[0].amount))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getGasPrice();
    getAmount();
  }, []);

  const navigateToCreatePayment = () => {
    navigate({ navigation, routeName: ROUTES.CREATE_PAYMENT });
  };
  const navigateToScanQRCode = () => {
    navigate({ navigation, routeName: ROUTES.QRCODESCAN });
  };
  const navigateToPaymentHistory = () => {
    navigate({ navigation, routeName: ROUTES.PAYMENT_HISTORY });
  };

  const navigateToMyAsset = () => {
    navigate({ navigation, routeName: ROUTES.MYASSET_SCREEN });
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
      onClick: () => navigateToPaymentHistory(),
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
      onClick: () => navigateToMyAsset(),
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
          <Text style={styles.extraData}>
            {CHAIN_DETAILS.NAME} : {CHAIN_DETAILS.ID}
          </Text>
          <View style={styles.tokenContainer}>
            <Text style={styles.extraData}>
              Wallet: {amount !== undefined ? getDisplayAmount(amount) : null}{' '}
              {CHAIN_DETAILS.DEFAULT_TOKEN.symbol}
            </Text>
            <Image
              source={{ uri: CHAIN_DETAILS.DEFAULT_TOKEN.image }}
              style={styles.image}
            />
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.extraData}>Average gas price</Text>
            <Text style={styles.extraData}>{gasDetails?.average}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.extraData}>Fastest gas price</Text>
            <Text style={styles.extraData}>{gasDetails?.high}</Text>
          </View>
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
    height: 180,
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
  extraData: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.6,
    paddingLeft: 20,
    marginTop: 5,
  },
  tokenContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    width: 15,
    height: 15,
    marginLeft: 5,
    marginTop: 6,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardContainerBottom: {
    margin: 20,
    padding: 20,
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
    flexDirection: 'column',
    height: 150,
  },
});
