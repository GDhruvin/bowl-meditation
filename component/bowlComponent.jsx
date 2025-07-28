import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Vibration,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  LongPressGestureHandler,
  RotationGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import InstructionModal from "../Model/InstructionModal";
import { Ionicons } from "@expo/vector-icons";
import InfoModel from "../Model/infoModal";

export default function BowlComponent() {
  const [bowlSound, setBowlSound] = useState(null);
  const [meditateSound, setMeditateSound] = useState(null);
  const [hasTappedBowl, setHasTappedBowl] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const isRotating = useRef(false);
  const tapRef = useRef();
  const longPressRef = useRef();

  // ⏳ Check if first-time user
  useEffect(() => {
    const checkFirstUse = async () => {
      const value = await AsyncStorage.getItem("hasUsed_Bowl");
      if (!value) {
        setShowInstructions(true);
      }
    };
    checkFirstUse();
  }, []);

  const onSingleTap = async () => {
    if (meditateSound) {
      const meditateStatus = await meditateSound.getStatusAsync();
      if (meditateStatus.isLoaded && meditateStatus.isPlaying) return;
    }

    if (bowlSound || isRotating.current) {
      const status = await bowlSound.getStatusAsync();
      if (status.isPlaying) return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sound/bowl-sound.mp3")
    );
    console.log("Single Tap");

    // 🔁 Reset state when sound finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setBowlSound(null);
      }
    });

    Vibration.vibrate(100);
    setHasTappedBowl(true);
    setBowlSound(sound);
    await sound.playAsync();
  };

  const onLongPress = async () => {
    console.log("✋ Long Press - force stop");

    // Stop bowl sound if exists
    if (bowlSound) {
      try {
        const status = await bowlSound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await bowlSound.stopAsync();
        }
        await bowlSound.unloadAsync();
      } catch (e) {
        console.log("Error stopping bowl sound:", e);
      }
      setBowlSound(null);
    }

    // Stop meditate sound if exists
    if (meditateSound) {
      try {
        const status = await meditateSound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await meditateSound.stopAsync();
        }
        await meditateSound.unloadAsync();
      } catch (e) {
        console.log("Error stopping meditate sound:", e);
      }
      setMeditateSound(null);
      isRotating.current = false;
    }
    setHasTappedBowl(false);
  };

  // 🔄 On rotation gesture
  const onRotateGestureEvent = async (event) => {
    if (!hasTappedBowl) {
      console.log("⚠️ Must tap bowl before rotating");
      return;
    }

    const { rotation } = event.nativeEvent;

    if (Math.abs(rotation) > 0.1) {
      // start sound if not rotating
      if (!isRotating.current) {
        console.log("Rotating");
        isRotating.current = true;
        Vibration.vibrate([0, 100, 100, 100]);
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sound/tibetan.mp3"),
          { isLooping: true, rate: 1.0, shouldCorrectPitch: true }
        );
        setMeditateSound(sound);

        if (bowlSound) {
          let bowlVolume = 1.0;

          const fadeOut = setInterval(async () => {
            bowlVolume -= 0.1;
            if (bowlVolume <= 0) {
              clearInterval(fadeOut);
              const bowlStatus = await bowlSound.getStatusAsync();
              if (bowlStatus.isPlaying) await bowlSound.stopAsync();
            } else {
              await bowlSound.setVolumeAsync(bowlVolume);
            }
          }, 100);
        }

        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setHasTappedBowl(false);
          }
        });
      }
    }
  };

  // 🛑 On rotation end
  const onRotateEnd = () => {
    if (isRotating.current && meditateSound) {
      let volume = 1.0;

      const fadeOut = setInterval(async () => {
        volume -= 0.1;
        if (volume <= 0) {
          await meditateSound.stopAsync();
          await meditateSound.unloadAsync();
          clearInterval(fadeOut);
          isRotating.current = false;
        } else {
          await meditateSound.setVolumeAsync(volume);
        }
      }, 2000);
    }
  };

  const resetStorage = async () => {
    await AsyncStorage.removeItem("hasUsed_Bowl");
    setShowInstructions(true);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Tibetan Bowl</Text>
        <TouchableOpacity onPress={() => setShowInfo(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <RotationGestureHandler
        onGestureEvent={onRotateGestureEvent}
        onEnded={onRotateEnd}
      >
        <LongPressGestureHandler
          ref={longPressRef}
          minDurationMs={600}
          onActivated={onLongPress}
        >
          <TapGestureHandler
            ref={tapRef}
            numberOfTaps={1}
            maxDurationMs={300}
            onActivated={onSingleTap}
            simultaneousHandlers={longPressRef}
          >
            <View style={styles.imageContainer}>
              {/* <TouchableOpacity style={styles.resetBtn} onPress={resetStorage}>
                <Text style={[styles.buttonText, { fontSize: 12 }]}>
                  Reset Storage (Test)
                </Text>
              </TouchableOpacity> */}
              <Image
                source={require("../assets/image/bowl.png")}
                style={styles.image}
              />
            </View>
          </TapGestureHandler>
        </LongPressGestureHandler>
      </RotationGestureHandler>

      <InstructionModal
        show={showInstructions}
        steps={[
          "👆 Step 1: Tap the bowl once to play a calming sound.",
          "🌀 Step 2: Use two fingers to rotate the bowl and begin meditation sound.",
          "✋ Step 3: Long press to stop all sounds anytime.",
        ]}
        storageKey="hasUsed_Bowl"
        onClose={() => setShowInstructions(false)}
      />

      <InfoModel visible={showInfo} onClose={() => setShowInfo(false)}>
        <Text style={styles.modalTitle}>About Tibetan Bell</Text>

        <Text style={styles.modalText}>
          Tibetan singing bells have been used for centuries in Himalayan
          regions as powerful tools for healing, meditation, and spiritual
          practices.
        </Text>

        <Text style={styles.modalTitle}>✨ Key Benefits</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Deep relaxation by slowing brain waves{"\n"}
          {"\u2022"} Reduce stress, anxiety & emotional tension{"\n"}
          {"\u2022"} Improve clarity, focus & mindfulness{"\n"}
          {"\u2022"} Activate healing via parasympathetic nervous system{"\n"}
          {"\u2022"} Aid in chakra balancing & energy cleansing
        </Text>

        <Text style={styles.modalTitle}>🛑 When to Use</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Before/after meditation to enhance stillness{"\n"}
          {"\u2022"} During yoga or breathwork as grounding anchor{"\n"}
          {"\u2022"} As a timer for mindful productivity sessions{"\n"}
          {"\u2022"} With children or beginners for mindfulness fun
        </Text>

        <Text style={styles.modalTitle}>🎧 App Usage Tips</Text>
        <Text style={styles.modalText}>
          {"\u2022"} Tap the bell for a bell sound{"\n"}
          {"\u2022"} Rotate with two fingers to play the humming loop{"\n"}
          {"\u2022"} Long press to stop all sounds instantly
        </Text>

        <Text style={styles.modalTitle}>📿 Spiritual Insight</Text>
        <Text style={styles.modalText}>
          The sound waves emitted by Tibetan bells resonate with the body's
          energy fields to clear blockages and bring balance between body, mind,
          and spirit.
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
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1C6758",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 150,
    backgroundColor: "#A91D3A",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
