import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skel } from 'react-native-ui-skel-expo';

import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../../constants';

const QRCodeShadow = () => {
  return (
    <View style={styles.page}>
      <Skel
        height={DEVICE_HEIGHT}
        width={DEVICE_WIDTH}
        styles={styles.loader}
        duration={800}
        backgroundColor="#000000"
        backgroundAnimationColor={[
          '#000000',
          '#111111',
          '#191919',
          '#111111',
          '#000000',
        ]}
      />
    </View>
  );
};

export default QRCodeShadow;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  loader: {
    flex: 1,
  },
});
