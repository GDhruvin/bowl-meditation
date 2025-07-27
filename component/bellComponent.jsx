import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Image,
  Vibration,
  TouchableOpacity,
  Text,
  Modal,
  View,
} from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import InstructionModal from "../Model/InstructionModal";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BellComponent() {
  const soundRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_Bell");
      if (!value) {
        setShowInstructions(true);
      }
    };
    checkFirstUse();
  }, []);

  // Load sound file
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/bell-hit.mp3"),
        { shouldPlay: false }
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  // Load sound on component mount and clean up on unmount
  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((error) => {
          console.error("Failed to unload sound", error);
        });
      }
    };
  }, []);

  const playSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
        Vibration.vibrate(100);
      } catch (error) {
        console.log("Sound playback failed", error);
      }
    }
  };

  const stopBellSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        console.log("Sound stopped");
      } catch (error) {
        console.error("Failed to stop sound", error);
      }
    }
  };

  const rotation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const rotate = Math.max(-15, Math.min(15, -gestureState.dx / 5));
        rotation.setValue(rotate);
      },
      onPanResponderRelease: () => {
        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        playSound();
      },
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-15, 15],
    outputRange: ["-15deg", "15deg"],
  });

  const animatedStyle = {
    transform: [{ rotateZ: rotateInterpolate }],
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Tibetan Bowl</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <LongPressGestureHandler onActivated={stopBellSound} minDurationMs={500}>
        <Animated.View {...panResponder.panHandlers} style={[animatedStyle]}>
          <Image
            source={require("../assets/image/bell.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </LongPressGestureHandler>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Hold the bell and drag it slightly left or right, then release to play the sound.",
          "✋ Step 2: Long press on the bell to stop the sound anytime.",
        ]}
        storageKey="hasUsed_Bell"
        onClose={() => setShowInstructions(false)}
      />

      <Modal visible={showInfo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About Tibetan Bowl</Text>
            <Text style={styles.modalText}>
              Tibetan singing bowls produce rich, deep tones when played. They
              are known to promote relaxation, reduce stress and anxiety, and
              aid in meditation and healing practices.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  image: {
    width: 400,
    height: 400,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  modalText: {
    fontSize: 16,
    color: "#444",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#333",
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
