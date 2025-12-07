import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Image,
  StyleSheet,
  Vibration,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Audio } from "expo-av";
import InstructionModal from "../Model/InstructionModal";
import { Ionicons } from "@expo/vector-icons";
import InfoModel from "../Model/infoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TuningForkComponent() {
  const soundRef = useRef(new Audio.Sound());
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      try {
        const storedData = await AsyncStorage.getItem("appLocalData");
        const parsed = storedData
          ? JSON.parse(storedData)
          : { instruments: {} };
        if (!parsed["instrument"]["hasUsed_TuningFork"]) {
          setShowInstructions(true);
        }
      } catch (error) {
        console.error("Failed to load appLocalData:", error);
        setShowInstructions(true); // Fallback to showing instructions on error
      }
    };
    checkFirstUse();
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((err) => console.log(err));
      }
    };
  }, []);

  const playSound = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await soundRef.current.unloadAsync();

      await soundRef.current.loadAsync(
        require("../assets/sound/tuning-fork-sound.mp3"),
        {},
        true
      );

      await soundRef.current.playAsync();
      Vibration.vibrate(100);
    } catch (e) {
      console.error("Error playing gong sound:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSound = async () => {
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.stopAsync();
      }
    } catch (e) {
      console.error("Error stopping gong sound:", e);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Tuning Fork</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Pressable
          onPress={playSound}
          onLongPress={stopSound}
          delayLongPress={300}
        >
          <Image
            source={require("../assets/image/tuning_forks.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Tap the tuning fork to play the sound.",
          "✋ Step 2: Long press to stop the sound anytime.",
        ]}
        storageKey="hasUsed_TuningFork"
        onClose={() => setShowInstructions(false)}
      />

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Tuning Fork</Text>

        <Text style={styles.modalText}>
          The tuning fork is a precision-crafted metal instrument that produces
          a pure, consistent tone when struck. It is widely used in sound
          healing, meditation, and vibrational therapy to promote balance,
          clarity, and energetic alignment.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Promotes relaxation through pure vibrational tones{"\n"}
          {"\u2022"} Reduces stress, tension, and mental clutter{"\n"}
          {"\u2022"} Enhances focus, clarity, and emotional balance{"\n"}
          {"\u2022"} Supports sound healing and chakra alignment{"\n"}
          {"\u2022"} Encourages energetic cleansing and harmony
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} During meditation to focus and center the mind{"\n"}
          {"\u2022"} In sound healing sessions to balance energy{"\n"}
          {"\u2022"} As a tool for mindfulness and stress relief{"\n"}
          {"\u2022"} In group settings to create a unified vibrational field
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the tuning fork nodes to play pure tones{"\n"}
          {"\u2022"} Experiment with different forks for varied frequencies
          {"\n"}
          {"\u2022"} Long press on a node to stop the sound instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The tuning fork’s clear, resonant tones align with the body’s energy
          centers, fostering a profound sense of balance, clarity, and spiritual
          connection.
        </Text>
      </InfoModel>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  imageContainer: {
    marginTop: "20%",
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
  },
});
