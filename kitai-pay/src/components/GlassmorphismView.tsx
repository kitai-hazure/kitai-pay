import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface GlassmorphismViewProps {
  children: React.ReactNode;
  blurType?: 'dark' | 'light' | 'xlight';
  blurAmount?: number;
  containerStyle?: StyleProp<ViewStyle>;
  glassColor?: string;
}

const GlassmorphismView = ({
  children,
  blurType,
  blurAmount,
  containerStyle,
  glassColor = 'rgba(255, 255, 255, 0.06)',
}: GlassmorphismViewProps) => {
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: glassColor },
      ]}>
      <BlurView
        overlayColor={glassColor}
        style={styles.blurContainer}
        blurType={blurType}
        blurAmount={blurAmount}
        reducedTransparencyFallbackColor="white">
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 15,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GlassmorphismView;
