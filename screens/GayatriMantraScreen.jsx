import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";
import { useLocalData } from "../hooks/useLocalData";

const mantraLines = [
  { sanskrit: "ॐ भूर्भुवः स्वः", english: "Om Bhur Bhuvah Svah" },
  { sanskrit: "तत्स॑वि॒तुर्वरे॑ण्यं॒", english: "Tat Savitur Varenyam" },
  { sanskrit: "भर्गो॑ दे॒वस्य॑ धीमहि।", english: "Bhargo Devasya Dhimahi" },
  {
    sanskrit: "धियो॒ यो नः॑ प्रचो॒दया॑त्॥",
    english: "Dhiyo Yo Nah Prachodayat",
  },
];

export default function GayatriMantraScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const soundRef = useRef(null);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const fadeAnims = useRef(
    mantraLines.map(() => new Animated.Value(0))
  ).current;
  const startTimeRef = useRef(null);
  const { updateSession } = useLocalData();

  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  const startChanting = async () => {
    startTimeRef.current = Date.now(); // track session start

    setIsRunning(true);

    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/gaytri_mantra.mp3"),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );
      soundRef.current = sound;

      // Start staggered fade-in animations for each line
      Animated.stagger(
        1000, // Delay between each line's animation start (adjust as needed)
        fadeAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  };

  const stopChanting = async (saveSession = true) => {
    // Calculate session duration
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    if (saveSession) {
      // Save session
      await updateSession("meditation", "Gaytri Mantra", duration);
    }

    // Fade out all lines in parallel
    Animated.parallel(
      fadeAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      // After animations complete, clean up
      if (soundRef.current) {
        try {
          soundRef.current.stopAsync();
          soundRef.current.unloadAsync();
        } catch (error) {
          console.error("Error stopping sound:", error);
        }
        soundRef.current = null;
      }
      setIsRunning(false);
      // Reset fade values
      fadeAnims.forEach((anim) => anim.setValue(0));
    });
  };

  useEffect(() => {
    return () => {
      stopChanting(false);
    };
  }, []);

  return (
    <ImageBackground
      source={require("../assets/image/gaytri_mantra_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gaytri Mantra</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Mantra Text */}
        <View style={styles.centerContent}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={toggleMusicModal}
              style={styles.iconButton}
            >
              <Ionicons name="musical-notes" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {isRunning && (
            <View style={styles.mantraContainer}>
              {isRunning && (
                <View style={styles.mantraContainer}>
                  {mantraLines.map((line, index) => (
                    <View
                      key={index}
                      style={{ alignItems: "center", marginVertical: 5 }}
                    >
                      <Animated.Text
                        style={[
                          styles.mantraText,
                          { opacity: fadeAnims[index] },
                        ]}
                      >
                        {line.sanskrit}
                      </Animated.Text>
                      <Animated.Text
                        style={[
                          styles.mantraEnglish,
                          { opacity: fadeAnims[index] },
                        ]}
                      >
                        {line.english}
                      </Animated.Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
    backgroundColor: "#3b3b3bff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30, 30, 30, 0.9)",
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
  mantraContainer: {
    alignItems: "center",
  },
  mantraText: {
    color: "white",
    fontSize: 40,
    textAlign: "center",
    marginVertical: 5,
  },
  mantraEnglish: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
    opacity: 0.85,
    marginTop: 2,
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
});
