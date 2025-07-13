import { StyleSheet, Text, View } from "react-native";

export default function BellComponent() {
  return (
    <View style={styles.instrumentView}>
      <Text style={styles.instrumentText}>🔔 Bell Component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  instrumentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instrumentText: {
    fontSize: 24,
    color: "#E0E7E9",
  },
});
