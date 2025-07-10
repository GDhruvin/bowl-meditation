import { useRef, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  RotationGestureHandler,
  LongPressGestureHandler,
} from "react-native-gesture-handler";

export default function HomeScreen() {
  const [bowlSound, setBowlSound] = useState(null);
  const [meditateSound, setMeditateSound] = useState(null);

  const isRotating = useRef(false);
  const tapRef = useRef();
  const longPressRef = useRef();

  // 🔊 Tap sound
  const onSingleTap = async () => {
    if (bowlSound) {
      const status = await bowlSound.getStatusAsync();
      if (status.isPlaying) return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/bowl-sound.mp3")
    );

    // 🔁 Reset state when sound finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setBowlSound(null);
      }
    });

    setBowlSound(sound);
    await sound.playAsync();
  };

  const onLongPress = async () => {
    console.log("✋ Long Press");
    // Stop and unload previous sound if it exists
    if (bowlSound) {
      await bowlSound.stopAsync();
    }
  };

  // 🔄 On rotation gesture
  const onRotateGestureEvent = async (event) => {
    const { rotation, velocity } = event.nativeEvent;

    if (Math.abs(rotation) > 0.1) {
      // start sound if not rotating
      if (!isRotating.current) {
        isRotating.current = true;
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/meditate_sound.mp3"),
          { isLooping: true, rate: 1.0, shouldCorrectPitch: true }
        );
        setMeditateSound(sound);
        bowlSound.stopAsync();
        await sound.playAsync();
      }

      if (meditateSound) {
        // Normalize velocity to rate (between 0.5 and 2.0)
        let rate = Math.min(Math.max(Math.abs(velocity) / 5, 0.5), 2.0);
        await meditateSound.setRateAsync(rate, true);
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
      }, 200);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <RotationGestureHandler
          onGestureEvent={onRotateGestureEvent}
          onEnded={onRotateEnd}
        >
          <LongPressGestureHandler
            ref={longPressRef}
            minDurationMs={600} // How long to press for "long press"
            onActivated={onLongPress}
          >
            <TapGestureHandler
              ref={tapRef}
              numberOfTaps={1}
              maxDurationMs={300} // Must release within 300ms to count as tap
              onActivated={onSingleTap}
              simultaneousHandlers={longPressRef} // Allow both
            >
              <View>
                <Image
                  source={require("../assets/bowl.png")}
                  style={styles.image}
                />
              </View>
            </TapGestureHandler>
          </LongPressGestureHandler>
        </RotationGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 350, height: 350, resizeMode: "contain" },
});
