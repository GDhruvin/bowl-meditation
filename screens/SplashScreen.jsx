import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home"); // Navigate after 3 sec
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <Text style={styles.text}>Meditation App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 200, height: 200, resizeMode: "contain" },
  text: { fontSize: 24, marginTop: 20 },
});
