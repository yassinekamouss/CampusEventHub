import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  scaleTo = 0.95,
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animatedStyle = {
    transform: [{ scale }],
  };

  return (
    <AnimatedPressableComponent
      {...props}
      style={[styles.base, style, animatedStyle]}
      onPressIn={(e) => {
        Animated.spring(scale, {
          toValue: scaleTo,
          useNativeDriver: true,
          friction: 5,
          tension: 200,
        }).start();
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 200,
        }).start();
        props.onPressOut?.(e);
      }}>
      {children}
    </AnimatedPressableComponent>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});
