import { FlatList, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';

import { DEVICE_WIDTH, DEVICE_HEIGHT, ROUTES, STORAGE } from '../constants';
import {
  ConnectWallet,
  useAddress,
  useLogin,
} from '@thirdweb-dev/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppNavigatorParamList } from '../navigation';
import { navigateWithReset } from '../helpers';
import { useDispatch } from 'react-redux';
import { setAddress, setID, setToken } from '../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DOT_SIZE = 10;

const OnboardingSlides = [
  {
    index: 0,
    animation: '',
    title: 'Welcome to Kitai Pay',
    description: 'The easiest way to pay for your purchases with crypto',
  },
  {
    index: 1,
    animation: '',
    title: 'Welcome to Kitai Pay 2',
    description: 'Buy crypto with your credit card',
  },
  {
    index: 2,
    animation: '',
    title: 'Welcome to Kitai Pay 3',
    description: 'Hodl your crypto and earn interest',
  },
];

interface OnboardingProps {
  navigation: StackNavigationProp<AppNavigatorParamList>;
}

interface CustomUseLogin {
  login: (options: any) => Promise<void>;
  response?: Response;
  isLoading: boolean;
}

const Onboarding = ({ navigation }: OnboardingProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollListRef = useRef<FlatList>(null);
  const { login, response } = useLogin() as CustomUseLogin;
  const address = useAddress();
  const dispatch = useDispatch();

  const setUpLogin = useCallback(
    async (data: any) => {
      console.log('data', data);
      if (data?.address && data?.token && data?._id) {
        dispatch(setAddress(data.address));
        dispatch(setToken(data.token));
        dispatch(setID(data._id));
        await AsyncStorage.multiSet([
          [STORAGE.USER_ADDRESS, data.address],
          [STORAGE.USER_TOKEN, data.token],
          [STORAGE.USER_ID, data._id],
        ]);
        navigateWithReset({ navigation, routeName: ROUTES.BIOMETRIC });
      }
    },
    [dispatch, navigation],
  );

  const tryLogin = useCallback(async () => {
    if (address) {
      try {
        console.log('Try Login Function is called');
        await login({ statement: 'Login to Kitai Pay app' });
      } catch (error) {
        console.log('error', error);
        // TODO: show bottom sheet and ask user to try login again in 3 seconds
        tryLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    (async () => {
      console.log('This useEffect is called');
      await tryLogin();
    })();
  }, [address, navigation, tryLogin]);

  useEffect(() => {
    (async () => {
      if (response !== undefined) {
        const data = await response.json();
        await setUpLogin(data);
      }
    })();
  }, [response, setUpLogin]);

  return (
    <>
      <FlatList
        data={OnboardingSlides}
        bounces={false}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={scrollListRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            {index === OnboardingSlides.length - 1 && (
              <ConnectWallet theme="light" />
            )}
          </View>
        )}
        keyExtractor={item => item.index.toString()}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {OnboardingSlides.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * DEVICE_WIDTH,
                index * DEVICE_WIDTH,
                (index + 1) * DEVICE_WIDTH,
              ],
              outputRange: [DOT_SIZE, DOT_SIZE * 2, DOT_SIZE],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.paginationDots, { width: dotWidth }]}
              />
            );
          })}
        </View>
      </View>
    </>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomContainer: {
    bottom: 50,
    position: 'absolute',
    width: DEVICE_WIDTH,
    justifyContent: 'center',
  },
  paginationDots: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 5,
    backgroundColor: 'blue',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
});
