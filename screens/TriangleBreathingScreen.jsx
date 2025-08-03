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

export default function TriangleBreathingScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);

  const phases = ["Inhale", "Hold", "Exhale"];
  const duration = 4000;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const intervalRef = useRef(null);

  const triangleSize = 300;
  const ballSize = 40;

  // Calculate triangle vertices
  const triangleHeight = (triangleSize * Math.sqrt(3)) / 2;
  const triangleVertices = [
    { x: triangleSize / 2 - ballSize / 2, y: 35 }, // Top vertex
    { x: triangleSize - ballSize, y: triangleHeight - ballSize / 2 }, // Bottom right
    { x: 0, y: triangleHeight - ballSize / 2 }, // Bottom left
  ];

  const ballPosition = useRef(
    new Animated.ValueXY({ x: 0, y: triangleHeight - ballSize / 2 })
  ).current;

  const [targetPosition, setTargetPosition] = useState({
    x: 0,
    y: triangleHeight - ballSize / 2,
  });

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

    if (index % 3 === 0) {
      // Inhale: Move from bottom left to top
      setTargetPosition(triangleVertices[0]);
    } else if (index % 3 === 1) {
      // Hold: Move from top to bottom right
      setTargetPosition(triangleVertices[1]);
    } else if (index % 3 === 2) {
      // Exhale: Move from bottom right to bottom left
      setTargetPosition(triangleVertices[2]);
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
      toValue: triangleVertices[2], // Reset to bottom left
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTargetPosition(triangleVertices[2]);
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

  // Triangle path for SVG
  const trianglePath = `M ${triangleSize / 2} 10 L ${
    triangleSize - 10
  } ${triangleHeight} L 10 ${triangleHeight} Z`;

  return (
    <ImageBackground
      source={require("../assets/image/triangle_breathing_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Triangle Breathing</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Animation Triangle */}
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
            style={[
              styles.triangle,
              { width: triangleSize, height: triangleHeight + 20 },
            ]}
          >
            {/* Triangle border using View components */}
            <View style={styles.triangleBorder}>
              {/* Top to bottom-right line */}
              <View
                style={[
                  styles.triangleLine,
                  {
                    position: "absolute",
                    top: 45,
                    left: 145,
                    width: 260,
                    height: 10,
                    transformOrigin: "left center",
                    transform: [{ rotate: "57deg" }],
                  },
                ]}
              />
              {/* Bottom-right to bottom-left line */}
              <View
                style={[
                  styles.triangleLine,
                  {
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    width: triangleSize - 20,
                    height: 10,
                  },
                ]}
              />
              {/* Bottom-left to top line */}
              <View
                style={[
                  styles.triangleLine,
                  {
                    position: "absolute",
                    top: 260,
                    left: 15,
                    width: 250,
                    height: 10,
                    transformOrigin: "left center",
                    transform: [{ rotate: "-58deg" }],
                  },
                ]}
              />
            </View>
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
  triangle: {
    position: "relative",
    marginBottom: 24,
  },
  triangleBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  triangleLine: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
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
