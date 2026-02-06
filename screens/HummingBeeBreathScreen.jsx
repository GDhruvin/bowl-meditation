import { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { BackgroundMusicModal } from "../component/backgroundMusicModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalData } from "../hooks/useLocalData";

export default function HummingBeeBreathScreen() {
    const navigation = useNavigation();
    const { updateSession } = useLocalData();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const waveAnim1 = useRef(new Animated.Value(0)).current;
    const waveAnim2 = useRef(new Animated.Value(0)).current;
    const waveAnim3 = useRef(new Animated.Value(0)).current;

    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState("Ready");
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
    const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
    const [isHummingEnabled, setIsHummingEnabled] = useState(true);

    const phases = ["Inhale", "Hum"];
    const durations = [6000, 10000]; // 6s inhale, 10s humming exhale

    const [phaseIndex, setPhaseIndex] = useState(0);
    const timeoutRef = useRef(null);
    const startTimeRef = useRef(null);
    const isBreathingRunning = useRef(false);
    const hummingSoundRef = useRef(null);
    const waveAnimationRef = useRef(null);

    // Load humming sound
    useEffect(() => {
        const loadHummingSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require("../assets/sound/humming.mp3")
                );
                hummingSoundRef.current = sound;
            } catch (error) {
                console.error("Error loading humming sound:", error);
            }
        };

        loadHummingSound();

        return () => {
            if (hummingSoundRef.current) {
                hummingSoundRef.current.unloadAsync();
            }
        };
    }, []);

    const startContinuousWaves = () => {
        // Reset all waves to 0
        waveAnim1.setValue(0);
        waveAnim2.setValue(0);
        waveAnim3.setValue(0);

        // Create continuous staggered wave animation
        waveAnimationRef.current = Animated.loop(
            Animated.stagger(400, [
                Animated.sequence([
                    Animated.timing(waveAnim1, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim1, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(waveAnim2, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim2, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(waveAnim3, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim3, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        waveAnimationRef.current.start();
    };

    const stopWaves = () => {
        if (waveAnimationRef.current) {
            waveAnimationRef.current.stop();
            waveAnimationRef.current = null;
        }
        waveAnim1.setValue(0);
        waveAnim2.setValue(0);
        waveAnim3.setValue(0);
    };

    const animateAndSchedule = async (index) => {
        const currentPhase = phases[index];
        const currentDuration = durations[index];
        const nextIndex = (index + 1) % phases.length;

        setPhase(currentPhase);

        if (isSpeechEnabled) {
            Speech.speak(currentPhase === "Hum" ? "Exhale and Hum" : currentPhase, {
                language: "en-US",
                pitch: 1.0,
                rate: 0.6,
                onError: (error) => console.error("Speech error:", error),
            });
        }

        // Animate based on phase
        if (currentPhase === "Inhale") {
            // Inhale: Circle grows, stop waves
            stopWaves();
            Animated.timing(scaleAnim, {
                toValue: 2.5,
                duration: currentDuration,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } else if (currentPhase === "Hum") {
            // Hum: Circle shrinks + continuous waves + humming sound
            startContinuousWaves();

            // Play humming sound only if enabled
            if (isHummingEnabled && hummingSoundRef.current) {
                try {
                    await hummingSoundRef.current.setPositionAsync(0);
                    await hummingSoundRef.current.playAsync();
                } catch (error) {
                    console.error("Error playing humming sound:", error);
                }
            }

            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: currentDuration,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        }

        // Schedule next phase
        timeoutRef.current = setTimeout(() => {
            setPhaseIndex(nextIndex);
            animateAndSchedule(nextIndex);
        }, currentDuration);
    };

    const startBreathing = () => {
        setIsRunning(true);
        isBreathingRunning.current = true;
        animateAndSchedule(phaseIndex);
        startTimeRef.current = Date.now();
    };

    const stopBreathing = async (saveSession = true) => {
        setIsRunning(false);
        clearTimeout(timeoutRef.current);
        setPhase("Ready");
        setPhaseIndex(0);

        // Calculate session duration
        const duration = startTimeRef.current
            ? Math.floor((Date.now() - startTimeRef.current) / 1000)
            : 0;

        // Save session only if running
        if (saveSession && isBreathingRunning.current) {
            await updateSession("breathing", "Humming Bee Breath", duration);
        }

        isBreathingRunning.current = false;

        // Stop humming sound safely
        if (hummingSoundRef.current) {
            try {
                const status = await hummingSoundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    await hummingSoundRef.current.stopAsync();
                }
            } catch (error) {
                // Silently ignore if sound is already unloaded
            }
        }

        // Reset animations
        stopWaves();
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();

        Speech.stop();
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
            stopBreathing(false);
        };
    }, []);

    const toggleSpeech = () => {
        setIsSpeechEnabled((prev) => {
            if (prev) {
                Speech.stop();
            }
            return !prev;
        });
    };

    const toggleMusicModal = () => {
        setIsMusicModalVisible(!isMusicModalVisible);
    };

    const toggleHumming = () => {
        setIsHummingEnabled((prev) => !prev);
    };

    return (
        <ImageBackground
            source={require("../assets/image/humming_bee_bg.png")}
            style={styles.container}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Humming Bee Breath</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Animation Area */}
                <View style={styles.centerContent}>
                    {/* Humming Sound Toggle (Top Left) */}
                    <View style={styles.hummingToggleContainer}>
                        <TouchableOpacity
                            onPress={toggleHumming}
                            style={[
                                styles.hummingToggleButton,
                                isRunning && styles.iconButtonDisabled,
                            ]}
                            disabled={isRunning}
                        >
                            <Text style={styles.beeIcon}>🐝</Text>
                            <Ionicons
                                name={isHummingEnabled ? "volume-high" : "volume-off"}
                                size={16}
                                color={isHummingEnabled ? "#4CAF50" : "#999"}
                                style={styles.hummingIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            onPress={toggleSpeech}
                            style={[
                                styles.iconButton,
                                isRunning && styles.iconButtonDisabled,
                            ]}
                            disabled={isRunning}
                        >
                            <Ionicons
                                name={isSpeechEnabled ? "volume-high" : "volume-off"}
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleMusicModal}
                            style={styles.iconButton}
                        >
                            <Ionicons name="musical-notes" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Circle Container with Waves */}
                    <View style={styles.circleContainer}>
                        {/* Wave 1 */}
                        <Animated.View
                            style={[
                                styles.wave,
                                {
                                    opacity: waveAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.7, 0],
                                    }),
                                    transform: [
                                        {
                                            scale: waveAnim1.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 2],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                        {/* Wave 2 */}
                        <Animated.View
                            style={[
                                styles.wave,
                                {
                                    opacity: waveAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.7, 0],
                                    }),
                                    transform: [
                                        {
                                            scale: waveAnim2.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 2],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                        {/* Wave 3 */}
                        <Animated.View
                            style={[
                                styles.wave,
                                {
                                    opacity: waveAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.7, 0],
                                    }),
                                    transform: [
                                        {
                                            scale: waveAnim3.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 2],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />

                        {/* Center Green Circle */}
                        <Animated.View
                            style={[
                                styles.circle,
                                {
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        />
                    </View>

                    <Text style={styles.phaseText}>{phase}</Text>

                    {/* Instructions */}
                    <Text style={styles.instructionText}>
                        {phase === "Hum"
                            ? "Make a gentle humming sound"
                            : phase === "Inhale"
                                ? "Breathe in deeply through your nose"
                                : "Close your eyes and relax"}
                    </Text>
                </View>

                {/* Start/Stop Buttons */}
                <View style={styles.buttonContainer}>
                    {isRunning ? (
                        <TouchableOpacity style={styles.buttonStop} onPress={stopBreathing}>
                            <Text style={styles.buttonText}>Stop</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonStart}
                            onPress={startBreathing}
                        >
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Music Selection Modal */}
                <BackgroundMusicModal
                    isVisible={isMusicModalVisible}
                    onClose={toggleMusicModal}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C2526",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(28, 37, 38, 0.85)",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2E3A3B",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 10,
        right: 20,
    },
    iconButton: {
        marginLeft: 16,
    },
    iconButtonDisabled: {
        opacity: 0.5,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    hummingToggleContainer: {
        position: "absolute",
        top: 10,
        left: 20,
        zIndex: 10,
    },
    hummingToggleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    beeIcon: {
        fontSize: 24,
        marginRight: 4,
    },
    hummingIcon: {
        marginLeft: 2,
    },
    circleContainer: {
        width: 300,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 10,
        borderRadius: 150,
        borderColor: "#ffff",
        marginBottom: 24,
    },
    wave: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 3,
        borderColor: "#4CAF50",
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#4CAF50",
    },
    phaseText: {
        fontSize: 28,
        color: "#4CAF50",
        fontWeight: "700",
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        color: "#CCCCCC",
        textAlign: "center",
        paddingHorizontal: 40,
        fontStyle: "italic",
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    buttonStart: {
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonStop: {
        backgroundColor: "#E53935",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
});
