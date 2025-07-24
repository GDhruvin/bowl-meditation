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
import InstructionModal from "../Model/InstructionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BellComponent() {
  const soundRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_Bell");
      if (!value) {
        setShowInstructions(true);
      }
    };
    checkFirstUse();
  }, []);

  // Load sound file
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/bell-hit.mp3"),
        { shouldPlay: false }
      );
      soundRef.current = sound;
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
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
        Vibration.vibrate(100);
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
      },
      onPanResponderRelease: () => {
        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        playSound();
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
    <>
      <LongPressGestureHandler onActivated={stopBellSound} minDurationMs={500}>
        <Animated.View {...panResponder.panHandlers} style={[animatedStyle]}>
          <Image
            source={require("../assets/image/bell.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </LongPressGestureHandler>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Hold the bell and drag it slightly left or right, then release to play the sound.",
          "✋ Step 2: Long press on the bell to stop the sound anytime.",
        ]}
        storageKey="hasUsed_Bell"
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 400,
  },
});
