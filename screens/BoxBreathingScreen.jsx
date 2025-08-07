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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BoxBreathingScreen() {
  const navigation = useNavigation();
  const ballPosition = useRef(new Animated.ValueXY({ x: -20, y: -20 })).current;
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);

  const phases = ["Inhale", "Hold", "Exhale", "Hold"];
  const duration = 4000;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const intervalRef = useRef(null);

  const [targetPosition, setTargetPosition] = useState({ x: -20, y: -20 });

  const squareSize = 300;
  const ballSize = 40;

  useEffect(() => {
    Animated.timing(ballPosition, {
      toValue: targetPosition,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [targetPosition]);

  const animatePhase = (index) => {
    const nextPhase = phases[index % phases.length];
    setPhase(nextPhase);

    if (isSpeechEnabled) {
      Speech.speak(nextPhase, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.6,
        onError: (error) => console.error("Speech error:", error),
      });
    }

    if (index % 4 === 0) {
      // Inhale: Move right (top-left to top-right)
      setTargetPosition({ x: squareSize - (ballSize - 5), y: -20 });
    } else if (index % 4 === 1) {
      // Hold: Move down (top-right to bottom-right)
      setTargetPosition({
        x: squareSize - (ballSize - 5),
        y: squareSize - (ballSize - 5),
      });
    } else if (index % 4 === 2) {
      // Exhale: Move left (bottom-right to bottom-left)
      setTargetPosition({ x: -20, y: squareSize - (ballSize - 5) });
    } else if (index % 4 === 3) {
      // Hold: Move up (bottom-left to top-left)
      setTargetPosition({ x: -20, y: -20 });
    }
  };

  const startBreathing = () => {
    setIsRunning(true);
    animatePhase(phaseIndex);
    intervalRef.current = setInterval(() => {
      setPhaseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % phases.length;
        animatePhase(nextIndex);
        return nextIndex;
      });
    }, duration);
  };

  const stopBreathing = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setPhase("Ready");
    setPhaseIndex(0);
    Animated.timing(ballPosition, {
      toValue: { x: -20, y: -20 },
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTargetPosition({ x: -20, y: -20 });
    });
    Speech.stop();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      Speech.stop();
    };
  }, []);

  const toggleSpeech = () => {
    setIsSpeechEnabled((prev) => {
      if (prev) {
        Speech.stop();
      }
      return !prev;
    });
  };

  // Toggle music modal visibility
  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  return (
    <ImageBackground
      source={require("../assets/image/box_breathing_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Box Breathing</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Animation Square */}
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
          <View
            style={[styles.square, { width: squareSize, height: squareSize }]}
          >
            <Animated.View
              style={[
                styles.ball,
                {
                  width: ballSize,
                  height: ballSize,
                  borderRadius: ballSize / 2,
                  transform: [
                    { translateX: ballPosition.x },
                    { translateY: ballPosition.y },
                  ],
                },
              ]}
            />
          </View>
          <Text style={styles.phaseText}>{phase}</Text>
        </View>
        {/* Start/Stop Buttons */}
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

        {/* Music Selection Modal */}
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
  square: {
    borderWidth: 10,
    borderRadius: 10,
    borderColor: "#ffff",
    position: "relative",
    marginBottom: 24,
  },
  ball: {
    backgroundColor: "#4CAF50",
    position: "absolute",
  },
  phaseText: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
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
