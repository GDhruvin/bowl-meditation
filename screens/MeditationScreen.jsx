import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Example breathing exercises data
const meditations = [
  {
    id: "1",
    name: "Om Chanting",
    description: "Chant Om to vibrate calmness and inner peace.",
    screen: "OmChantingScreen",
  },
  {
    id: "2",
    name: "Body Scan Meditation",
    description: "Gently scan your body to release tension and relax.",
    screen: "BodyScanMeditationScreen",
  },
  {
    id: "3",
    name: "Chakra Meditation",
    description: "Align and energize your chakras with color and sound.",
    screen: "ChakraMeditationScreen",
  },
  {
    id: "4",
    name: "Candle Gazing (Trataka)",
    description: "Focus your mind and vision on a single flame.",
    screen: "CandleGazingScreen",
  },
  {
    id: "5",
    name: "Gratitude Meditation",
    description: "Uplift your mind with thoughts of gratitude and peace.",
    screen: "GratitudeMeditationScreen",
  },

  // 🔁 Mantra Variations
  {
    id: "6",
    name: "So Hum Mantra",
    description: "A calming breath-aligned mantra meaning 'I am that'.",
    screen: "SoHumMantraScreen",
  },
  {
    id: "7",
    name: "Shanti Mantra",
    description: "Invoke inner and outer peace with 'Om Shanti Shanti Shanti'.",
    screen: "ShantiMantraScreen",
  },
  {
    id: "8",
    name: "Gayatri Mantra",
    description: "A sacred chant for illumination and clarity.",
    screen: "GayatriMantraScreen",
  },
  {
    id: "9",
    name: "Maha Mrityunjaya Mantra",
    description: "A healing chant for strength and well-being.",
    screen: "MrityunjayaMantraScreen",
  },
  {
    id: "10",
    name: "Custom Mantra",
    description: "Choose your own Sanskrit or personal mantra.",
    screen: "CustomMantraScreen",
  },
];


export default function MeditationScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={1}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate(item.screen)}
      >
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Meditation Exercises</Text>
      <FlatList
        data={meditations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#2A3436",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
    color: "#4CAF50",
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  startButton: {
    marginTop: 12,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
