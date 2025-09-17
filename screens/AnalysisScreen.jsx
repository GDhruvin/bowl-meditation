import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalysisScreen({}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Analyis Exercises</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
    paddingBottom: "80%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 16,
    marginHorizontal: 20,
  },
});
