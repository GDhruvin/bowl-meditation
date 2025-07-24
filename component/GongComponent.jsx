import { useRef, useState } from "react";
import { Pressable, Image, StyleSheet, Vibration } from "react-native";
import { Audio } from "expo-av";
import InstructionModal from "../Model/InstructionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GongComponent() {
  const soundRef = useRef(new Audio.Sound());
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
  },
});
