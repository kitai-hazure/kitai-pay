import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import AnimatedLottieView from 'lottie-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomModalSheet from './CustomBottomModalSheet';
import { COLORS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, selectErrorState } from '../redux';

const ErrorSheet = () => {
  const ref = useRef<BottomSheet>(null);
  const { hasError, errorMessage } = useSelector(selectErrorState);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('hasError', hasError);
    if (hasError) {
      ref.current?.expand();
      setTimeout(() => {
        ref.current?.close();
        dispatch(clearError());
      }, 2500);
    }
  }, [hasError, dispatch]);

  return (
    <CustomBottomModalSheet
      snapPoints={['50%']}
      ref={ref}
      index={-1}
      backgroundStyle={styles.bottomSheetBack}>
      <View style={styles.container}>
        <Text style={styles.title}>{errorMessage}</Text>
        <AnimatedLottieView
          style={styles.lottieView}
          source={require('../assets/animations/error.json')}
          autoPlay
          loop
        />
      </View>
    </CustomBottomModalSheet>
  );
};

export default ErrorSheet;

const styles = StyleSheet.create({
  lottieView: {
    width: 200,
    height: 200,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetBack: {
    backgroundColor: COLORS.MODAL_BACKGROUND,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 20,
  },
});
