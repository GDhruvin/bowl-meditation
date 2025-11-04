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
import { useLocalData } from "../hooks/useLocalData";

const yogaSteps = [
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250606/vbeezv19sxrcmultkqer.png",
    },
    text: "Sit upright with legs extended straight forward together. Keep your spine tall and arms resting at your sides.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250607/bkao6kbr4diupcd50fnm.png",
    },
    text: "Inhale and raise both arms straight overhead, elongating the spine and preparing for the forward fold.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250609/aqjfuylx9ctgf8aeimsc.png",
    },
    text: "Exhale and begin leaning forward from the hips. Reach your arms toward your feet while keeping the back lengthened.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250610/tmea4i1wycknykt47ler.png",
    },
    text: "Fold fully into Paschimottanasana. Hold your feet or shins, relax the head toward the knees, and keep the spine extended.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250609/aqjfuylx9ctgf8aeimsc.png",
    },
    text: "To release, slowly lift your torso halfway up, keeping your back long and controlled.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250607/bkao6kbr4diupcd50fnm.png",
    },
    text: "Lower your arms back to the sides while returning to an upright seated position.",
  },
  {
    image: {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760250606/vbeezv19sxrcmultkqer.png",
    },
    text: "Return to the starting seated position, sitting tall with legs extended and arms resting at your sides.",
  },
];

export default function PaschimottanasanaScreen() {
  const navigation = useNavigation();
  const { updateSession } = useLocalData();
  const [isRunning, setIsRunning] = useState(false);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const stepTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const isYogaRunning = useRef(false);

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
    isYogaRunning.current = true;
    setCurrentStep(0);
    speakStep(yogaSteps[0].text);
    startTimeRef.current = Date.now(); // track session start

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
    }, 13000);
  };

  const stopChanting = async (saveSession = true) => {
    // Calculate session duration
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    if (saveSession || isYogaRunning.current) {
      // Save session
      await updateSession("yoga", "Paschimottanasana", duration);
    }

    setIsRunning(false);
    isYogaRunning.current = false;
    clearInterval(stepTimerRef.current);
    Speech.stop();
  };

  useEffect(() => {
    return () => {
      stopChanting(false);
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
      source={require("../assets/image/paschimottanasana_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paschimottanasana</Text>
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
              Press Start to begin Paschimottanasana
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
