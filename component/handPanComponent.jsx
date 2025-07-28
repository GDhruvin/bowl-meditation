import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Vibration,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import InstructionModal from "../Model/InstructionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import InfoModel from "../Model/infoModal";

export default function HandPanComponent() {
  const soundRefs = useRef([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showInfo, setShowInfo] = useState(false);

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
      await sound.replayAsync();
    } else {
      console.warn("Sound not loaded yet for index:", index);
    }
  };

  useEffect(() => {
    loadSounds();

    return () => {
      soundRefs.current.forEach((sound) => {
        if (sound) sound.unloadAsync();
      });
    };
  }, []);

  const nodePositions = [
    { top: 0.34, left: 0.35, width: 0.16, height: 0.09 }, // Node 5
    { top: 0.34, left: 0.59, width: 0.14, height: 0.1 }, // Node 6
    { top: 0.46, left: 0.75, width: 0.15, height: 0.11 }, // Node 7
    { top: 0.62, left: 0.73, width: 0.18, height: 0.15 }, // Node 8
    { top: 0.75, left: 0.5, width: 0.2, height: 0.13 }, // Node 1
    { top: 0.73, left: 0.18, width: 0.2, height: 0.11 }, // Node 2
    { top: 0.56, left: 0.07, width: 0.16, height: 0.12 }, // Node 3
    { top: 0.4, left: 0.16, width: 0.14, height: 0.1 }, // Node 4
    { top: 0.52, left: 0.42, width: 0.19, height: 0.1 }, // Node 9
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

  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Handpan</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/image/handpan.jpg")}
        style={styles.image}
        resizeMode="contain"
        onLayout={handleImageLayout}
      />

      {/* Overlay nodes */}
      {nodePositions.map((pos, index) => (
        <Pressable
          key={index}
          onPress={() => playSound(index)}
          style={[
            styles.node,
            {
              width: imageDimensions.width * pos.width,
              height: imageDimensions.height * pos.height,
              top: imageDimensions.height * pos.top,
              left: imageDimensions.width * pos.left,
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

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Handpan</Text>

        <Text style={styles.modalText}>
          The handpan is a modern, hand-played percussion instrument originating
          from Switzerland, known for its unique, soothing tones. It is widely
          used in meditation, music therapy, and spiritual practices across the
          globe.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Promotes deep relaxation through melodic vibrations{"\n"}
          {"\u2022"} Reduces stress, anxiety, and mental fatigue{"\n"}
          {"\u2022"} Enhances focus, creativity, and emotional expression{"\n"}
          {"\u2022"} Supports mindfulness and meditative states{"\n"}
          {"\u2022"} Encourages emotional and energetic balance
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} During meditation to deepen your practice{"\n"}
          {"\u2022"} In music therapy or sound healing sessions{"\n"}
          {"\u2022"} As a creative outlet for improvisation and relaxation{"\n"}
          {"\u2022"} With groups for collaborative music-making
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the handpan nodes to play different notes{"\n"}
          {"\u2022"} Experiment with combinations for melodic patterns{"\n"}
          {"\u2022"} Long press on a node to stop the sound instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The handpan's resonant tones create harmonic vibrations that align
          with the body's energy centers, fostering a sense of peace,
          connection, and spiritual harmony.
        </Text>
      </InfoModel>
    </View>
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
  container: {
    // flex: 1,
    position: "relative",
    width: "100%",
    height: "80%",
  },
  image: {
    width: "100%",
    height: "100%",
    maxWidth: Dimensions.get("window").width,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  node: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.6,
    // borderWidth: 1,
    // borderColor: "#000",
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
