import { StyleSheet, Text, View } from "react-native";

export default function HandPanComponent() {
  return (
    <View style={styles.instrumentView}>
      <Text style={styles.instrumentText}>🔔 Hand Pan Component</Text>
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
