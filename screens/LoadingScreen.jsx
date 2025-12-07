import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoadingScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem("hasSeenOnboarding");
                if (value === "true") {
                    navigation.replace("WelcomeBack");
                } else {
                    navigation.replace("Onboarding");
                }
            } catch (e) {
                // Fallback to onboarding on error
                navigation.replace("Onboarding");
            }
        };

        checkFirstLaunch();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4CAF50" />
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
});
