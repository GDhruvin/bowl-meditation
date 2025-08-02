import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";

export default function AlternateNostrilBreathingScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const intervalRef = useRef(null);

  const duration = 5000;
  const rhombusSize = 200;
  const r = rhombusSize / Math.SQRT2;

  const points = {
    1: { x: 0, y: -r }, // Top
    2: { x: -r, y: 0 }, // Left
    3: { x: 0, y: r }, // Bottom
    4: { x: r, y: 0 }, // Right
  };

  const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: -r })).current;

  const phases = [
    "Inhale Left", // Move to point 2 (left)
    "Hold", // Stay at point 2
    "Exhale Right", // Move to point 3 (bottom)
    "Inhale Right", // Move to point 4 (right)
    "Hold", // Stay at point 4
    "Exhale Left", // Move to point 1 (top)
  ];

  const speak = (text) => {
    if (isSpeechEnabled) {
      Speech.stop(); // Prevent speech overlap
      Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.6,
        onError: (error) => console.error("Speech error:", error),
      });
    }
  };

  const animatePhase = (index) => {
    const phase = phases[index];
    let targetPosition;

    switch (index) {
      case 0: // Inhale Left: Move to point 2 (left)
        targetPosition = points[2];
        break;
      case 1: // Hold: Stay at point 2 (left)
        targetPosition = points[2];
        break;
      case 2: // Exhale Right: Move to point 3 (bottom)
        targetPosition = points[3];
        break;
      case 3: // Inhale Right: Move to point 4 (right)
        targetPosition = points[4];
        break;
      case 4: // Hold: Stay at point 4 (right)
        targetPosition = points[4];
        break;
      case 5: // Exhale Left: Move to point 1 (top)
        targetPosition = points[1];
        break;
    }

    Animated.timing(ballPosition, {
      toValue: targetPosition,
      duration: phase.includes("Hold") ? 0 : duration, // No animation for Hold phases
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    speak(phase);
  };

  const startBreathing = () => {
    if (isRunning) return; // Prevent multiple starts
    setIsRunning(true);
    animatePhase(phaseIndex);

    intervalRef.current = setInterval(() => {
      setPhaseIndex((prev) => {
        const next = (prev + 1) % phases.length;
        animatePhase(next);
        return next;
      });
    }, duration);
  };

  const stopBreathing = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setPhaseIndex(0);
    Speech.stop();
    Animated.timing(ballPosition, {
      toValue: points[1], // Reset to top (point 1)
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      Speech.stop();
    };
  }, []);

  const toggleSpeech = () => {
    setIsSpeechEnabled((prev) => {
      if (prev) Speech.stop();
      return !prev;
    });
  };

  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  return (
    <ImageBackground
      source={require("../assets/image/alternate_nostril_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alternate Nostril Breathing</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.centerContent}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={toggleSpeech}
              style={[
                styles.iconButton,
                isRunning && styles.iconButtonDisabled,
              ]}
              disabled={isRunning}
            >
              <Ionicons
                name={isSpeechEnabled ? "volume-high" : "volume-off"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMusicModal}
              style={styles.iconButton}
            >
              <Ionicons name="musical-notes" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.rhombusContainer}>
            <View style={styles.rhombusOutline} />
            <Animated.View
              style={[
                styles.ball,
                {
                  transform: [
                    { translateX: ballPosition.x },
                    { translateY: ballPosition.y },
                  ],
                },
              ]}
            />
          </View>

          <Text style={styles.phaseText}>{phases[phaseIndex]}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {isRunning ? (
            <TouchableOpacity style={styles.buttonStop} onPress={stopBreathing}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonStart}
              onPress={startBreathing}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>

        <BackgroundMusicModal
          isVisible={isMusicModalVisible}
          onClose={toggleMusicModal}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(28, 37, 38, 0.85)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2E3A3B",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 20,
  },
  iconButton: {
    marginLeft: 16,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rhombusContainer: {
    width: 240,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  rhombusOutline: {
    width: 200,
    height: 200,
    borderWidth: 5,
    borderColor: "#ffff",
    transform: [{ rotate: "45deg" }], // Rotate to form rhombus
    position: "absolute",
  },
  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    position: "absolute",
  },
  phaseText: {
    fontSize: 28,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonStart: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonStop: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
