import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

export default function OnboardingScreens({ navigation }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const screens = [
    {
      image: require("../assets/image/onboarding1.png"),
      title: "Welcome to MindAura",
      subtitle: "Begin your journey to inner peace",
      description:
        "Discover guided meditations designed to calm your mind and nurture your soul",
    },
    {
      image: require("../assets/image/onboarding2.png"),
      title: "Find Your Balance",
      subtitle: "Personalized meditation sessions",
      description:
        "Choose from breathing exercises, mindfulness practices, and sleep stories",
    },
    {
      image: require("../assets/image/onboarding3.png"),
      title: "Start Your Practice",
      subtitle: "Transform your daily routine",
      description:
        "Just a few minutes each day can bring clarity, focus, and tranquility",
    },
  ];

  useEffect(() => {
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-advance timer
    const timer = setTimeout(() => {
      if (currentScreen < screens.length - 1) {
        handleNext();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentScreen((prev) => prev + 1);
        slideAnim.setValue(0);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentScreen((prev) => prev - 1);
        slideAnim.setValue(0);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleStart = () => {
    navigation.replace("MainTabs");
  };

  const handleSkip = () => {
    setCurrentScreen(screens.length - 1);
    fadeAnim.setValue(1);
    slideAnim.setValue(1);
  };

  const screen = screens[currentScreen];

  return (
    <View style={styles.container}>
      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.05, 0.15],
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Skip Button */}
      {currentScreen < screens.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Animated Illustration */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                {
                  scale: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.pulseRing1,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing2,
              {
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.imageBox}>
            <Image source={screen.image} style={styles.image} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.subtitle}>{screen.subtitle}</Text>
          <Text style={styles.description}>{screen.description}</Text>
        </Animated.View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentScreen
                  ? styles.progressDotActive
                  : styles.progressDotInactive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentScreen > 0 && (
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={handlePrev}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonSecondaryText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentScreen < screens.length - 1 ? (
            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                currentScreen === 0 && styles.buttonFull,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonPrimaryText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonPrimaryText}>Start Journey</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#4CAF50",
    opacity: 0.1,
  },
  pulseRing2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#4CAF50",
    opacity: 0.05,
  },
  imageBox: {
    width: 256,
    height: 256,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  textContent: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#98BFBF",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#98BFBF",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 32,
    backgroundColor: "#D0F0E0",
  },
  progressDotInactive: {
    width: 8,
    backgroundColor: "#2A3435",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonFull: {
    flex: 1,
  },
  buttonPrimaryText: {
    color: "#1C2526",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#2A3435",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(208, 240, 224, 0.2)",
  },
  buttonSecondaryText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
});
