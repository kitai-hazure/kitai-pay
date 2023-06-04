import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface LoadingButtonProps {
  onSubmit: () => void;
  loading: boolean;
  buttonText: string;
}

const LoadingButton = ({
  onSubmit,
  loading,
  buttonText,
}: LoadingButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onSubmit}
      style={styles.button}
      // disabled={loading}
    >
      {loading ? (
        <AnimatedLottieView
          style={styles.lottieView}
          source={require('../assets/animations/button-loading.json')}
          autoPlay
          loop
        />
      ) : (
        <>
          <FontAwesome name="send-o" size={24} color="white" />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default LoadingButton;

const styles = StyleSheet.create({
  lottieView: {
    height: 125,
    width: 125,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    marginVertical: 15,
    marginHorizontal: 20,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    marginLeft: 10,
  },
});
