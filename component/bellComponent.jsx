import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Image,
  Vibration,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import InstructionModal from "../Model/InstructionModal";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoModel from "../Model/infoModal";

export default function BellComponent() {
  const soundRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
      <View style={styles.header}>
        <Text style={styles.title}>Tibetan Bowl</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
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

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Tibetan Bowl</Text>

        <Text style={styles.modalText}>
          Tibetan singing bowls have been used for centuries in Himalayan
          regions as powerful tools for healing, meditation, and spiritual
          practices.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Deep relaxation by slowing brain waves{"\n"}
          {"\u2022"} Reduce stress, anxiety & emotional tension{"\n"}
          {"\u2022"} Improve clarity, focus & mindfulness{"\n"}
          {"\u2022"} Activate healing via parasympathetic nervous system{"\n"}
          {"\u2022"} Aid in chakra balancing & energy cleansing
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Before/after meditation to enhance stillness{"\n"}
          {"\u2022"} During yoga or breathwork as grounding anchor{"\n"}
          {"\u2022"} As a timer for mindful productivity sessions{"\n"}
          {"\u2022"} With children or beginners for mindfulness fun
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the bowl for a bell sound{"\n"}
          {"\u2022"} Rotate with two fingers to play the humming loop{"\n"}
          {"\u2022"} Long press to stop all sounds instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The sound waves emitted by Tibetan bowls resonate with the body's
          energy fields to clear blockages and bring balance between body, mind,
          and spirit.
        </Text>
      </InfoModel>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  image: {
    width: 400,
    height: 400,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  modalText: {
    fontSize: 16,
    color: "#444",
  },
});
