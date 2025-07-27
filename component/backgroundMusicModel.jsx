import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export const BackgroundMusicModal = ({ isVisible, onClose }) => {
  const images = {
    "ocen_sound_img.jpg": require("../assets/bg_sound/ocen_sound_img.jpg"),
    "healing_sound_img.jpg": require("../assets/bg_sound/healing_sound_img.jpg"),
    "forest_sound_img.jpg": require("../assets/bg_sound/forest_sound_img.jpg"),
    "om_sound-img.jpg": require("../assets/bg_sound/om_sound-img.jpg"),
    "meditation_sound_img.jpg": require("../assets/bg_sound/meditation_sound_img.jpg"),
    "meditation2_sound_img.jpg": require("../assets/bg_sound/meditation2_sound_img.jpg"),
    "soul_soud_img.jpg": require("../assets/bg_sound/soul_soud_img.jpg"),
    "bird_sound_img.jpg": require("../assets/bg_sound/bird_sound_img.jpg"),
  };

  const sounds = {
    "beach-sounds-10min.mp3": require("../assets/bg_sound/beach-sounds-10min.mp3"),
    "forest-sounds-10min.mp3": require("../assets/bg_sound/forest-sounds-10min.mp3"),
    "healing-meditation-15min.mp3": require("../assets/bg_sound/healing-meditation-15min.mp3"),
    "om-meditation-15min.mp3": require("../assets/bg_sound/om-meditation-15min.mp3"),
    "meditation-1.mp3": require("../assets/bg_sound/meditation-1.mp3"),
    "meditation-2.mp3": require("../assets/bg_sound/meditation-2.mp3"),
    "spiritual-music.mp3": require("../assets/bg_sound/spiritual-music.mp3"),
    "forest-birds-10min.mp3": require("../assets/bg_sound/forest-birds-10min.mp3"),
  };

  const musicList = [
    {
      id: "1",
      title: "Peaceful Beach Sounds",
      file: "beach-sounds-10min.mp3",
      image: "ocen_sound_img.jpg",
    },
    {
      id: "2",
      title: "Peaceful Forest Sounds",
      file: "forest-sounds-10min.mp3",
      image: "forest_sound_img.jpg",
    },
    {
      id: "3",
      title: "Healing Meditation Music",
      file: "healing-meditation-15min.mp3",
      image: "healing_sound_img.jpg",
    },
    {
      id: "4",
      title: "OM Meditation",
      file: "om-meditation-15min.mp3",
      image: "om_sound-img.jpg",
    },
    {
      id: "5",
      title: "Meditation Music 1",
      file: "meditation-1.mp3",
      image: "meditation_sound_img.jpg",
    },
    {
      id: "6",
      title: "Meditation Music 2",
      file: "meditation-2.mp3",
      image: "meditation2_sound_img.jpg",
    },
    {
      id: "7",
      title: "Spiritual Music",
      file: "spiritual-music.mp3",
      image: "soul_soud_img.jpg",
    },
    {
      id: "8",
      title: "Forest Birds Relaxing Sounds",
      file: "forest-birds-10min.mp3",
      image: "bird_sound_img.jpg",
    },
  ];

  const [currentSound, setCurrentSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const soundRef = useRef(null);

  const playSound = async (file, id) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingId(null);
      }

      const { sound } = await Audio.Sound.createAsync(sounds[file], {
        shouldPlay: true,
        isLooping: true,
      });

      soundRef.current = sound;
      setPlayingId(id);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
      soundRef.current = null;
      setPlayingId(null);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    return () => {
      stopSound();
    };
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Background Music</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={onClose} style={{ marginLeft: 12 }}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={musicList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.musicItem}
                onPress={() => playSound(item.file, item.id)}
              >
                <Image source={images[item.image]} style={styles.musicImage} />
                <Text style={styles.musicTitle}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() =>
                    playingId === item.id
                      ? stopSound()
                      : playSound(item.file, item.id)
                  }
                >
                  <Ionicons
                    name={
                      playingId === item.id ? "pause-circle" : "play-circle"
                    }
                    size={28}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noMusicText}>No music found</Text>
            }
            style={styles.modalBody}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2E3A3B",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: "100%",
    height: "50%",
    maxHeight: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  modalBody: {
    flex: 1,
  },
  noMusicText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    width: "100%",
    justifyContent: "space-between",
  },
  musicImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  musicTitle: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  playButton: {
    marginRight: 10,
  },
  stopAllButton: {
    marginRight: 8,
  },
});
