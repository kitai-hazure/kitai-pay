import { Animated } from 'react-native';

declare module 'react-native-ui-skel-expo' {
  export interface SkelProps {
    width: number;
    height: number;
    duration?: number;
    backgroundColor?: string;
    backgroundAnimationColor?: string[];
    styles?: Animated.WithAnimatedValue<ViewStyle> | ViewStyle;
  }

  export const Skel: React.FC<SkelProps>;
}
