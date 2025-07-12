import { useState, useRef } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SoundScreen() {
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const soundRef = useRef(null);

  const loadAndPlaySound = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/simple.mp3"),
      {
        shouldPlay: true,
        isLooping: false,
        volume,
        rate,
        shouldCorrectPitch: true,
      }
    );
    soundRef.current = sound;
    setIsPlaying(true);
    setIsContinueEnabled(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
      }
    });
  };

  const handleContinue = async () => {
    if (soundRef.current) {
      await soundRef.current.setIsLoopingAsync(true);
      const status = await soundRef.current.getStatusAsync();
      if (!status.isPlaying) {
        await soundRef.current.playAsync();
      }
    }
  };

  const handleStop = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }
    setIsPlaying(false);
    setIsContinueEnabled(false);
  };

  const handleVolumeChange = async (val) => {
    setVolume(val);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(val);
    }
  };

  const handleRateChange = async (val) => {
    setRate(val);
    if (soundRef.current) {
      await soundRef.current.setRateAsync(val, true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button title="Play" onPress={loadAndPlaySound} color="#4CAF50" />
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isContinueEnabled}
          color="#4CAF50"
        />
        <Button title="Stop" onPress={handleStop} color="#4CAF50" />

        <View style={styles.sliderContainer}>
          <Text style={styles.text}>Volume: {volume.toFixed(2)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#A7B7B9"
            thumbTintColor="#E0E7E9"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.text}>Speed: {rate.toFixed(2)}x</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            value={rate}
            onValueChange={handleRateChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#A7B7B9"
            thumbTintColor="#E0E7E9"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1C2526",
  },
  sliderContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  slider: {
    width: 250,
    height: 40,
  },
  text: {
    color: "#E0E7E9",
    fontSize: 16,
  },
});
