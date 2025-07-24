import { View, Image, StyleSheet, Pressable, Vibration } from "react-native";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import InstructionModal from "../Model/InstructionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HandPanComponent() {
  const soundRefs = useRef([]);
  const [showInstructions, setShowInstructions] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_HandPan");
      if (!value) {
        setShowInstructions(true);
      }
    };
    checkFirstUse();
  }, []);

  const loadSounds = async () => {
    const modules = [
      require("../assets/sound/handpan_5.mp3"),
      require("../assets/sound/handpan_6.mp3"),
      require("../assets/sound/handpan_7.mp3"),
      require("../assets/sound/handpan_8.mp3"),
      require("../assets/sound/handpan_1.mp3"),
      require("../assets/sound/handpan_2.mp3"),
      require("../assets/sound/handpan_3.mp3"),
      require("../assets/sound/handpan_4.mp3"),
      require("../assets/sound/handpan_9.mp3"),
    ];

    for (let i = 0; i < modules.length; i++) {
      const sound = new Audio.Sound();
      await sound.loadAsync(modules[i]);
      soundRefs.current[i] = sound;
    }
  };

  const playSound = async (index) => {
    const sound = soundRefs.current[index];
    if (sound) {
      Vibration.vibrate(50);
      await sound.replayAsync(); // More efficient than playAsync after first load
    } else {
      console.warn("Sound not loaded yet for index:", index);
    }
  };

  useEffect(() => {
    loadSounds();

    return () => {
      // Clean up sounds on unmount
      soundRefs.current.forEach((sound) => {
        if (sound) sound.unloadAsync();
      });
    };
  }, []);

  const nodePositions = [
    { top: 35, left: 143, width: 60, height: 45 }, // 5
    { top: 47, left: 239, width: 50, height: 50 }, // 6
    { top: 115, left: 300, width: 55, height: 60 }, // 7
    { top: 220, left: 290, width: 65, height: 70 }, // 8
    { top: 290, left: 200, width: 75, height: 70 }, // 1
    { top: 270, left: 80, width: 75, height: 70 }, // 2
    { top: 175, left: 35, width: 60, height: 65 }, // 3
    { top: 81, left: 70, width: 50, height: 60 }, // 4
    { top: 155, left: 165, width: 70, height: 50 }, // 9
  ];

  const nodeColors = [
    "#ff9999",
    "#ffcc99",
    "#ffff99",
    "#ccff99",
    "#99ffcc",
    "#99ccff",
    "#cc99ff",
    "#ff99cc",
    "#d9d9d9",
  ];

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/image/handpan.jpg")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Overlay nodes */}
      {nodePositions.map((pos, index) => (
        <Pressable
          key={index}
          onPress={() => playSound(index)}
          style={[
            styles.node,
            {
              width: pos.width,
              height: pos.height,
              top: pos.top,
              left: pos.left,
              // backgroundColor: nodeColors[index],
            },
          ]}
        />
      ))}

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Tap the handpan nodes to play different sounds.",
          "✋ Step 2: Long press on a node to stop the sound anytime.",
        ]}
        storageKey="hasUsed_HandPan"
        onClose={() => setShowInstructions(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 400,
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  node: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.6,
    // borderWidth: 1,
    // borderColor: "#000",
  },
});
