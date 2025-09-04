import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";

const yogaSteps = [
  {
    image: require("../assets/padmasana/1.png"),
    text: "Sit on the mat with legs extended forward, back straight, hands resting on thighs.",
  },
  {
    image: require("../assets/padmasana/2.png"),
    text: "Bend your right leg and place your right foot on top of your left thigh, keeping the left leg extended forward.",
  },
  {
    image: require("../assets/padmasana/3.png"),
    text: "Bend your left leg and place the left foot on top of your right thigh. Sit upright in full Lotus Pose with hands on knees.",
  },
  {
    image: require("../assets/padmasana/2.png"),
    text: "Release your left leg, placing it back on the mat, while keeping the right foot on your left thigh.",
  },
  {
    image: require("../assets/padmasana/1.png"),
    text: "Extend both legs forward and return to the seated starting position with back straight.",
  },
];

export default function PadmasanaScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const stepTimerRef = useRef(null);

  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  const speakStep = (text) => {
    Speech.stop();
    if (isSpeechEnabled) {
      Speech.speak(text, { language: "en", rate: 0.9, pitch: 1.0 });
    }
  };

  const startChanting = () => {
    setIsRunning(true);
    setCurrentStep(0);
    speakStep(yogaSteps[0].text);

    stepTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < yogaSteps.length) {
          if (isSpeechEnabled) {
            speakStep(yogaSteps[nextStep].text);
          }
          return nextStep;
        } else {
          if (isSpeechEnabled) {
            speakStep(yogaSteps[0].text);
          }
          return 0;
        }
      });
    }, 10000);
  };

  const stopChanting = () => {
    setIsRunning(false);
    clearInterval(stepTimerRef.current);
    Speech.stop();
  };

  useEffect(() => {
    return () => {
      stopChanting();
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

  return (
    <ImageBackground
      source={require("../assets/image/padmasana_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Padmasana (Lotus Pose) </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Om Symbol */}
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
          {isRunning ? (
            <>
              <Image
                source={yogaSteps[currentStep].image}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>{yogaSteps[currentStep].text}</Text>
            </>
          ) : (
            <Text style={styles.stepText}>Press Start to begin Padmasana</Text>
          )}
        </View>

        {/* Start/Stop Buttons */}
        <View style={styles.buttonContainer}>
          {isRunning ? (
            <TouchableOpacity style={styles.buttonStop} onPress={stopChanting}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonStart}
              onPress={startChanting}
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
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  omImage: {
    width: 300,
    height: 300,
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
  stepImage: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginHorizontal: 20,
  },
});
