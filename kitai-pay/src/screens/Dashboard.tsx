import { Button, StyleSheet, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import GlassmorphismView from '../components/GlassmorphismView';
import { StackNavigationProps, navigate, shortenedAddress } from '../helpers';
import { handleNotification } from '../components/Notification';
import { MainNavigatorParamList } from '../navigation';
import useSecureRoute from '../hooks/useSecureRoute';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import DashboardShadow from './shadows/DashboardShadow';
import { ROUTES, COLORS } from '../constants';

type DashboardProps = StackNavigationProps<MainNavigatorParamList, 'DASHBOARD'>;

const Dashboard = ({ navigation }: DashboardProps) => {
  const start = useSecureRoute(navigation);
  const { address } = useSelector(selectAuthState);
  const shortAddress = shortenedAddress(address);
  console.log('shortAddress', shortAddress);

  const navigateToCreatePayment = () => {
    navigate({ navigation, routeName: ROUTES.CREATE_PAYMENT });
  };

  if (!start) {
    return <DashboardShadow />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 1 }}
        // colors={['#080200', '#270103', '#670d30', '#ce083d']}
        end={{ x: 1, y: 1 }}
        colors={[
          '#000000',
          '#111111',
          '#111111',
          '#222222',
          '#111111',
          '#111111',
          '#000000',
        ]}
        style={styles.container}>
        <GlassmorphismView
          containerStyle={styles.glassContainer}
          blurAmount={20}
          blurType="light">
          <View style={styles.introContainer} />
        </GlassmorphismView>
        <Button
          title="NOTIFY ME"
          onPress={() => handleNotification('TITLE', 'HEYLOO')}
        />
        <Button
          title="Create Payment"
          onPress={() => navigateToCreatePayment()}
        />
      </LinearGradient>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  glassContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    height: 150,
  },
  innerGlassContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  introContainer: {
    flex: 1,
    margin: 20,
  },
  introRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  introRowLeftText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
