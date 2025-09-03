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
    image: require("../assets/downwarddog/1.png"),
    text: "Start in Tabletop: hands under shoulders, knees under hips, back flat, gaze downward.",
  },
  {
    image: require("../assets/downwarddog/2.png"),
    text: "Tuck your toes under and gently lift your knees a few inches off the mat, keeping arms straight and back flat.",
  },
  {
    image: require("../assets/downwarddog/3.png"),
    text: "Lift your hips higher, straighten arms, keep knees slightly bent and heels lifted. Relax your head between your arms.",
  },
  {
    image: require("../assets/downwarddog/4.png"),
    text: "Extend fully into Downward Dog: hips lifted in an inverted V, arms and legs straight, heels pressing toward the mat, head relaxed.",
  },
  {
    image: require("../assets/downwarddog/3.png"),
    text: "Bend your knees slightly and lower your heels, keeping hips high and arms straight.",
  },
  {
    image: require("../assets/downwarddog/2.png"),
    text: "Lower your knees closer to the mat, toes still tucked, back flat, arms straight.",
  },
  {
    image: require("../assets/downwarddog/1.png"),
    text: "Return to Tabletop: hands under shoulders, knees under hips, back neutral, gaze downward.",
  },
];

export default function DownwardDogScreen() {
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
      source={require("../assets/image/downwarddog_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Adho Mukha Svanasana (Downward Dog)
          </Text>
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
            <Text style={styles.stepText}>
              Press Start to begin Adho Mukha Svanasana
            </Text>
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
