import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import AnimatedLottieView from 'lottie-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomModalSheet from './CustomBottomModalSheet';
import { COLORS } from '../constants';

interface SuccessProps {
  successfull: boolean;
  next: () => void;
  successText: string;
}

const SuccessModal = ({ successfull, next, successText }: SuccessProps) => {
  const ref = useRef<BottomSheet>(null);
  console.log('successfull', successfull);

  useEffect(() => {
    console.log('useEffect', successfull);
    if (successfull) {
      ref.current?.expand();
      setTimeout(() => {
        ref.current?.close();
        next();
      }, 2000);
    }
  }, [successfull, next]);

  return (
    <CustomBottomModalSheet
      snapPoints={['50%']}
      ref={ref}
      index={-1}
      backgroundStyle={styles.bottomSheetBack}>
      <View style={styles.container}>
        <Text style={styles.title}>{successText}</Text>
        <AnimatedLottieView
          style={styles.lottieView}
          source={require('../assets/animations/success.json')}
          autoPlay
          loop
        />
      </View>
    </CustomBottomModalSheet>
  );
};

export default SuccessModal;

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
