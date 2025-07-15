import { Audio } from "expo-av";
import { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Image,
  Vibration,
} from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";

export default function BellComponent() {
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/bell-hit.mp3")
    );

    Vibration.vibrate(100);
    await sound.playAsync();
  };

  const rotation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const rotate = Math.max(-15, Math.min(15, -gestureState.dx / 5));
        rotation.setValue(rotate);
        playSound();
      },
      onPanResponderRelease: () => {
        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-15, 15],
    outputRange: ["-15deg", "15deg"],
  });

  const animatedStyle = {
    transform: [{ rotateZ: rotateInterpolate }],
  };

  return (
    <Animated.View {...panResponder.panHandlers} style={[animatedStyle]}>
      <Image
        source={require("../assets/bell.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 400,
  },
});
