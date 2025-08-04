import { useState, useEffect, useRef } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";

export default function BellowsBreathScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  const maxReps = 30;
  const maxRounds = 3;
  const repDuration = 600;

  const speak = (text) => {
    if (isSpeechEnabled) {
      Speech.speak(text, {
        language: "en-US",
        pitch: 1,
        rate: 0.8,
      });
    }
  };

  const animatePulse = () => {
    pulseAnim.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.3,
        duration: repDuration / 2,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: repDuration / 2,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startBreathing = () => {
    setIsRunning(true);
    setRepCount(0);
    speak(`Round ${round} Start`);

    intervalRef.current = setInterval(() => {
      setRepCount((prev) => {
        animatePulse();
        if (prev + 1 >= maxReps) {
          clearInterval(intervalRef.current);
          handleRoundCompletion();
          return prev;
        }
        return prev + 1;
      });
    }, repDuration);
  };

  const handleRoundCompletion = () => {
    speak(`Round ${round} Complete`);
    if (round < maxRounds) {
      setTimeout(() => {
        setRound((prev) => prev + 1);
        setRepCount(0);
        startBreathing();
      }, 2000); // small pause between rounds
    } else {
      setIsRunning(false);
      speak("Bellows Breath Complete");
    }
  };

  const stopBreathing = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRepCount(0);
    setRound(1);
    Speech.stop();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      Speech.stop();
    };
  }, []);

  return (
    <ImageBackground
      source={require("../assets/image/bellows_breath_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bellows Breath</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Breathing Animation */}
        <View style={styles.centerContent}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => setIsSpeechEnabled((prev) => !prev)}
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
              onPress={() => setIsMusicModalVisible(true)}
              style={styles.iconButton}
            >
              <Ionicons name="musical-notes" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text style={styles.counterText}>
            Rep: {repCount} / {maxReps}
          </Text>
          <Text style={styles.roundText}>
            Round: {round} / {maxRounds}
          </Text>
        </View>

        {/* Buttons */}
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

        {/* Music Modal */}
        <BackgroundMusicModal
          isVisible={isMusicModalVisible}
          onClose={() => setIsMusicModalVisible(false)}
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
    borderBottomColor: "#1C2526",
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
  pulseCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#4CAF50",
    opacity: 0.9,
    marginBottom: 24,
  },
  counterText: {
    fontSize: 22,
    color: "white",
    marginTop: 20,
    marginBottom: 8,
  },
  roundText: {
    fontSize: 18,
    color: "#cccccc",
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
