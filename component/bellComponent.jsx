import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Image,
  Vibration,
} from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";

export default function BellComponent() {
  const soundRef = useRef(null);
  const lastRotation = useRef(0);

  // Load sound file
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/bell-hit.mp3"),
        { shouldPlay: false }
      );
      soundRef.current = sound;
      console.log("Sound loaded successfully", soundRef.current);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  // Load sound on component mount and clean up on unmount
  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((error) => {
          console.error("Failed to unload sound", error);
        });
      }
    };
  }, []);

  const playSound = async () => {
    console.log("soundRef", soundRef);

    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.log("Sound playback failed", error);
      }
    }
  };

  const stopBellSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        console.log("Sound stopped");
      } catch (error) {
        console.error("Failed to stop sound", error);
      }
    }
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
        stopBellSound();
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
    <LongPressGestureHandler
      onActivated={stopBellSound}
      minDurationMs={500}
    >
      <Animated.View {...panResponder.panHandlers} style={[animatedStyle]}>
        <Image
          source={require("../assets/bell.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 400,
  },
});
