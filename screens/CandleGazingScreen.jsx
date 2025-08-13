import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { useState, useRef } from "react";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";

export default function CandleGazingScreen() {
  const navigation = useNavigation();
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const videoRef = useRef(null); // Reference to control the Video component

  const toggleMusicModal = () => {
    setIsMusicModalVisible(!isMusicModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* Video Component */}
      <Video
        ref={videoRef}
        source={require("../assets/video/candle.mp4")}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        shouldPlay
        onError={(error) => console.log("Video Error:", error)}
      />

      {/* Overlay with reduced opacity */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.content} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Candle Gazing</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Center Instructions */}
        <View style={styles.centerContent}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={toggleMusicModal}
              style={styles.iconButton}
            >
              <Ionicons name="musical-notes" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <BackgroundMusicModal
          isVisible={isMusicModalVisible}
          onClose={toggleMusicModal}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, 
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 20,
  },
  iconButton: {
    marginLeft: 16,
  },
});
