import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { View, StyleSheet, Image, Vibration } from "react-native";
import {
  LongPressGestureHandler,
  RotationGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

export default function BowlComponent() {
  const [bowlSound, setBowlSound] = useState(null);
  const [meditateSound, setMeditateSound] = useState(null);
  const [hasTappedBowl, setHasTappedBowl] = useState(false);

  const isRotating = useRef(false);
  const tapRef = useRef();
  const longPressRef = useRef();

  // 🔊 Tap sound
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
      require("../assets/bowl-sound.mp3")
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
          require("../assets/tibetan.mp3"),
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

  return (
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
          <View>
            <Image
              source={require("../assets/bowl.png")}
              style={styles.image}
            />
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </RotationGestureHandler>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});
