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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import InfoModel from "../Model/infoModal";

export default function GongComponent() {
  const soundRef = useRef(new Audio.Sound());
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_Gong");
      if (!value) {
        setShowInstructions(true);
      }
    };
    checkFirstUse();
  }, []);

  const playSound = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await soundRef.current.unloadAsync();

      await soundRef.current.loadAsync(
        require("../assets/sound/gong_sound.mp3"),
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
        <Text style={styles.title}>Gong</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <Pressable
        onPress={playSound}
        onLongPress={stopSound}
        delayLongPress={300}
      >
        <Image
          source={require("../assets/image/gong.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Tap the gong to play the sound.",
          "✋ Step 2: Long press to stop the sound anytime.",
        ]}
        storageKey="hasUsed_Gong"
        onClose={() => setShowInstructions(false)}
      />

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Gong</Text>

        <Text style={styles.modalText}>
          The gong is a traditional percussion instrument with origins in East
          Asia, revered for its deep, resonant tones. It is widely used in sound
          healing, meditation, and ceremonial practices to create transformative
          sonic experiences.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Induces deep relaxation through powerful vibrations{"\n"}
          {"\u2022"} Reduces stress, tension, and emotional blockages{"\n"}
          {"\u2022"} Enhances mental clarity and spiritual awareness{"\n"}
          {"\u2022"} Supports energy cleansing and chakra alignment{"\n"}
          {"\u2022"} Promotes a sense of unity and connection
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} During meditation to deepen your inner focus{"\n"}
          {"\u2022"} In sound baths or healing sessions for immersion{"\n"}
          {"\u2022"} During ceremonies to mark transitions or rituals{"\n"}
          {"\u2022"} In group settings for collective mindfulness
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the gong nodes to play different tones{"\n"}
          {"\u2022"} Experiment with rhythmic patterns for dynamic effects{"\n"}
          {"\u2022"} Long press on a node to stop the sound instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The gong's profound vibrations resonate with the body's energy fields,
          clearing blockages and fostering a deep sense of peace, balance, and
          spiritual awakening.
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
  image: {
    width: "100%",
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
