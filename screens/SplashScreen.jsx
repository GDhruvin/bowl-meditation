import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // const timer = setTimeout(() => {
    //   navigation.replace("MainTabs");
    // }, 4000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        MindAura
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Calm your mind. Center your soul.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2526",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#D0F0E0",
    backgroundColor: "#2A3435",
  },
  title: {
    color: "#D0F0E0",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "#98BFBF",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
});
