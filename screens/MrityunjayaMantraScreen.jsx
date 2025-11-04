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
  {
    sanskrit: "ॐ त्र्य॑म्बकं यजामहे सु॒गन्धिं॑ पुष्टि॒वर्ध॑नम् ।",
    english: "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam",
  },
  {
    sanskrit: "उ॒र्वा॒रु॒कमि॑व॒ बन्ध॑नान्मृ॒त्योर्मु॑क्षीय॒ माऽमृता॑॑त्",
    english: "Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat",
  },
];

export default function MrityunjayaMantraScreen() {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const soundRef = useRef(null);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const fadeAnims = useRef(
    mantraLines.map(() => new Animated.Value(0))
  ).current;
  const startTimeRef = useRef(null);
  const { updateSession } = useLocalData();
  const isMeditationRunning = useRef(false);

  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  const startChanting = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        console.log("Previous sound cleanup error:", e);
      }
      soundRef.current = null;
    }

    startTimeRef.current = Date.now();
    isMeditationRunning.current = true;
    setIsRunning(true);

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/maha_mrityunjaya.mp3"),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );
      soundRef.current = sound;

      // Start staggered fade-in animations
      fadeAnims.forEach((anim) => anim.setValue(0)); // reset animations
      Animated.stagger(
        1000,
        fadeAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        )
      ).start();
    } catch (error) {
      console.error("Error starting chanting:", error);
    }
  };

  const stopChanting = async (saveSession = true) => {
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    if (saveSession && isMeditationRunning.current) {
      await updateSession("meditation", "Maha Mrityunjaya Mantra", duration);
    }

    Animated.parallel(
      fadeAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      )
    ).start(async () => {
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (error) {
          console.error("Error stopping sound:", error);
        }
        soundRef.current = null;
      }
      setIsRunning(false);
      isMeditationRunning.current = false;
    });
  };

  useEffect(() => {
    return () => {
      stopChanting(false);
    };
  }, []);

  return (
    <ImageBackground
      source={require("../assets/image/maha_mrityunjaya_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Maha Mrityunjaya Mantra</Text>
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
                      style={{ alignItems: "center", marginVertical: 8 }}
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
    marginHorizontal: 20,
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
