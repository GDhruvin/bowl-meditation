import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Example breathing exercises data
const breathingExercises = [
  {
    id: "1",
    name: "Box Breathing",
    description:
      "Inhale, hold, exhale, hold — each for 4 seconds to calm the mind.",
    screen: "BoxBreathingScreen",
  },
  {
    id: "2",
    name: "4-7-8 Breathing",
    description: "Relax with 4s inhale, 7s hold, and 8s exhale rhythm.",
    screen: "FourSevenEightScreen",
  },
  {
    id: "3",
    name: "Alternate Nostril (Nadi Shodhana)",
    description: "Balance energy by alternating nostril breathing.",
    screen: "AlternateNostrilScreen",
  },
  {
    id: "4",
    name: "Ocean Breath (Ujjayi)",
    description: "Deep breathing with a soft sound like ocean waves.",
    screen: "OceanBreathScreen",
  },
  {
    id: "5",
    name: "Bee Breath (Bhramari)",
    description: "Exhale with a humming sound to soothe the nervous system.",
    screen: "BeeBreathScreen",
  },
];

export default function BreathingScreen({ navigation }) {
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
      <Text style={styles.header}>Breathing Exercises</Text>
      <FlatList
        data={breathingExercises}
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
