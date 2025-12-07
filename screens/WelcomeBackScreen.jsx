import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function WelcomeBackScreen() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Start entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous pulse animation
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

        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                navigation.replace("MainTabs");
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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

            {/* Main Content */}
            <View style={styles.content}>
                {/* Animated Illustration */}
                <Animated.View
                    style={[
                        styles.imageContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim },
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
                        <Image
                            source={require("../assets/image/onboarding1.png")}
                            style={styles.image}
                        />
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
                                        inputRange: [0, 50],
                                        outputRange: [0, 20],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.title}>Welcome back to Mind Ripple</Text>
                    <Text style={styles.subtitle}>Continue your journey to inner peace</Text>
                    <Text style={styles.description}>
                        Let's resume your practice and find your calm
                    </Text>
                </Animated.View>

                {/* Loading Indicator */}
                <Animated.View
                    style={[
                        styles.loadingContainer,
                        {
                            opacity: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.6],
                            }),
                        },
                    ]}
                >
                    <View style={styles.loadingBar}>
                        <Animated.View
                            style={[
                                styles.loadingProgress,
                                {
                                    width: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0%", "100%"],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </Animated.View>
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
    loadingContainer: {
        width: width * 0.6,
        alignItems: "center",
    },
    loadingBar: {
        width: "100%",
        height: 4,
        backgroundColor: "#2A3435",
        borderRadius: 2,
        overflow: "hidden",
    },
    loadingProgress: {
        height: "100%",
        backgroundColor: "#4CAF50",
        borderRadius: 2,
    },
});