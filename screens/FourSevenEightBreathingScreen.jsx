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

export default function FourSevenEightBreathingScreen() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);

  const phases = ["Inhale", "Hold", "Exhale"];
  const durations = [4000, 7000, 8000]; // 4s inhale, 7s hold, 8s exhale
  const animationDurations = [4000, 3900, 4500]; // 4s inhale, 7s hold, 8s exhale

  const [phaseIndex, setPhaseIndex] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const animateAndSchedule = (index) => {
    const currentPhase = phases[index];
    const currentDuration = durations[index];
    const nextIndex = (index + 1) % phases.length;

    setPhase(currentPhase);

    if (isSpeechEnabled) {
      Speech.speak(currentPhase, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.6,
        onError: (error) => console.error("Speech error:", error),
      });
    }

    // Animate
    Animated.timing(scaleAnim, {
      toValue:
        currentPhase === "Inhale" ? 2.5 : currentPhase === "Hold" ? 2.5 : 1, // Exhale
      duration: durations[index],
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Schedule next phase
    timeoutRef.current = setTimeout(() => {
      setPhaseIndex(nextIndex);
      animateAndSchedule(nextIndex);
    }, currentDuration);
  };

  const startBreathing = () => {
    setIsRunning(true);
    animateAndSchedule(phaseIndex); // kick off the first phase
  };

  const stopBreathing = () => {
    setIsRunning(false);
    clearTimeout(timeoutRef.current);
    setPhase("Ready");
    setPhaseIndex(0);

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Speech.stop();
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
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
          <Text style={styles.headerTitle}>4-7-8 Breathing</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Animation Circle */}
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
          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [{ scale: scaleAnim }],
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
    paddingTop: 48,
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
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 10,
    borderRadius: 150,
    borderColor: "#ffff",
    marginBottom: 24,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
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
