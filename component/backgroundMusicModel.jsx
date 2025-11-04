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
    "ocen_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209756/toglbpovtwzamzl8dhac.jpg",
    },
    "healing_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209743/foyyt1f971stjrwjwxhy.jpg",
    },
    "forest_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209749/s32g5p056scpwoio0uwm.jpg",
    },
    "om_sound-img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209747/ay3rydhwuy3yrfakbxjd.jpg",
    },
    "meditation_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209743/q63syhs3gkki1ykcqyy8.jpg",
    },
    "meditation2_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209743/jsifbyo5hmhgtu3a3ib4.jpg",
    },
    "soul_soud_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209747/nkm2m4epabcvkbu63e6l.jpg",
    },
    "bird_sound_img.jpg": {
      uri: "https://res.cloudinary.com/djwmj9czu/image/upload/v1760209745/figyr9oz9uy5hkxyqmdz.jpg",
    },
  };

  const sounds = {
    "beach-sounds-10min.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291206/avjc2pjfv0xafygysnj2.mp3",
    },
    "forest-sounds-10min.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291318/whnsmyuzdfq4zbuths40.mp3",
    },
    "healing-meditation-15min.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291381/mxvvohgdnwbqe40qod2g.mp3",
    },
    "om-meditation-15min.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291561/uw5ywpbhsgxa7rnmilli.mp3",
    },
    "meditation-1.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291437/rmysque8kzyz38wcsuvm.mp3",
    },
    "meditation-2.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291493/kskzwog6heowxjwpcchw.mp3",
    },
    "spiritual-music.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291645/kquc6ti6e7ib2celvomb.mp3",
    },
    "forest-birds-10min.mp3": {
      uri: "https://res.cloudinary.com/djwmj9czu/video/upload/v1760291263/zedmoowrnlc2xco16lxk.mp3",
    },
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

  const [playingId, setPlayingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);

  const playSound = async (file, id) => {
    if (isLoading) return; // prevent multiple quick taps
    setIsLoading(true);

    try {
      // Stop previous sound first
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingId(null);
      }

      // Now safely start new one
      const { sound } = await Audio.Sound.createAsync(sounds[file], {
        shouldPlay: true,
        isLooping: true,
      });
      soundRef.current = sound;
      setPlayingId(id);
    } catch (error) {
      console.error("Error playing sound:", error);
    } finally {
      setIsLoading(false);
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

    return () => stopSound();
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
            <TouchableOpacity onPress={onClose} style={{ marginLeft: 12 }}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={musicList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.musicItem}
                disabled={isLoading}
                onPress={() =>
                  playingId === item.id
                    ? stopSound()
                    : playSound(item.file, item.id)
                }
              >
                <Image source={images[item.image]} style={styles.musicImage} />
                <Text style={styles.musicTitle}>{item.title}</Text>
                <Ionicons
                  name={playingId === item.id ? "pause-circle" : "play-circle"}
                  size={28}
                  color={isLoading ? "gray" : "#4CAF50"}
                />
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
  modalBody: { flex: 1 },
  noMusicText: { fontSize: 16, color: "white", textAlign: "center" },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    justifyContent: "space-between",
  },
  musicImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  musicTitle: { flex: 1, fontSize: 16, color: "white" },
});
