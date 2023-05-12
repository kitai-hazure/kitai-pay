import { FlatList, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

import { DEVICE_WIDTH, DEVICE_HEIGHT, ROUTES } from '../constants';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppNavigatorParamList } from '../navigation';
import { navigateWithReset } from '../helpers';

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

const Onboarding = ({ navigation }: OnboardingProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollListRef = useRef<FlatList>(null);

  const address = useAddress();

  useEffect(() => {
    console.log('Checking if logged in');
    if (address) {
      console.log('User logged in: ', address);
      console.log('Navigating to main');
      navigateWithReset({ navigation, routeName: ROUTES.MAIN });
    }
  }, [address, navigation]);

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
