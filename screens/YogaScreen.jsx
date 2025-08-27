import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Example breathing exercises data
const yogaPoses = [
  {
    id: "1",
    name: "Tadasana (Mountain Pose)",
    description: "Improves posture, balance, and calm focus.",
    screen: "TadasanaScreen",
  },
  {
    id: "2",
    name: "Vrikshasana (Tree Pose)",
    description: "Enhances balance, stability, and concentration.",
    screen: "VrikshasanaScreen",
  },
  {
    id: "3",
    name: "Bhujangasana (Cobra Pose)",
    description: "Strengthens spine and opens the chest.",
    screen: "BhujangasanaScreen",
  },
  {
    id: "4",
    name: "Adho Mukha Svanasana (Downward Dog)",
    description: "Stretches hamstrings, calves, and strengthens arms.",
    screen: "DownwardDogScreen",
  },
  {
    id: "5",
    name: "Padmasana (Lotus Pose)",
    description: "Classic meditative pose promoting inner peace.",
    screen: "PadmasanaScreen",
  },
  {
    id: "6",
    name: "Shavasana (Corpse Pose)",
    description: "Relaxes the body and mind completely.",
    screen: "ShavasanaScreen",
  },
  {
    id: "7",
    name: "Surya Namaskar (Sun Salutation)",
    description: "A dynamic sequence of 12 poses that energizes the body.",
    screen: "SuryaNamaskarScreen",
  },
  {
    id: "8",
    name: "Trikonasana (Triangle Pose)",
    description: "Improves flexibility, balance, and stimulates digestion.",
    screen: "TrikonasanaScreen",
  },
  {
    id: "9",
    name: "Utkatasana (Chair Pose)",
    description: "Strengthens legs, back, and builds stamina.",
    screen: "UtkatasanaScreen",
  },
  {
    id: "10",
    name: "Dhanurasana (Bow Pose)",
    description: "Opens chest and strengthens back and abdominal muscles.",
    screen: "DhanurasanaScreen",
  },
  {
    id: "11",
    name: "Halasana (Plow Pose)",
    description: "Calms the mind, reduces stress, and stretches the spine.",
    screen: "HalasanaScreen",
  },
  {
    id: "12",
    name: "Paschimottanasana (Seated Forward Bend)",
    description: "Stretches spine, shoulders, and hamstrings.",
    screen: "PaschimottanasanaScreen",
  },
];


export default function YogaScreen({ navigation }) {
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
      <Text style={styles.header}>Yoga Exercises</Text>
      <FlatList
        data={yogaPoses}
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
