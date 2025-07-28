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

export default function OceanDrumComponent() {
  const soundRef = useRef(new Audio.Sound());
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_OceanDrum");
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
        require("../assets/sound/Ocean_drum_sound.mp3"),
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
        <Text style={styles.title}>Ocean Drum</Text>
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
          source={require("../assets/image/ocean_drum.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Tap the ocean drum to play the sound.",
          "✋ Step 2: Long press to stop the sound anytime.",
        ]}
        storageKey="hasUsed_OceanDrum"
        onClose={() => setShowInstructions(false)}
      />

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Ocean Drum</Text>

        <Text style={styles.modalText}>
          The ocean drum is a unique percussion instrument filled with small
          beads, creating soothing sounds that mimic ocean waves. It is widely
          used in sound healing, meditation, and relaxation practices to evoke
          calmness and serenity.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Promotes relaxation through wave-like sounds{"\n"}
          {"\u2022"} Reduces stress, anxiety, and mental tension{"\n"}
          {"\u2022"} Enhances mindfulness and emotional tranquility{"\n"}
          {"\u2022"} Supports sound healing and meditative states{"\n"}
          {"\u2022"} Encourages a connection to nature’s rhythms
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} During meditation to create a calming atmosphere{"\n"}
          {"\u2022"} In sound healing or therapy sessions for relaxation{"\n"}
          {"\u2022"} As a tool for mindfulness and stress relief{"\n"}
          {"\u2022"} In group settings to evoke a shared sense of peace
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the drum nodes to play wave-like sounds{"\n"}
          {"\u2022"} Experiment with different rhythms to mimic ocean tides
          {"\n"}
          {"\u2022"} Long press on a node to stop the sound instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The ocean drum’s flowing sounds resonate with the body’s natural
          rhythms, fostering a deep sense of peace, grounding, and connection to
          the elemental energy of water.
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
