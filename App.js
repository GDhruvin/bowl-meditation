import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "./screens/LoadingScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import WelcomeBackScreen from "./screens/WelcomeBackScreen";
import TabNavigator from "./navigators/TabNavigator";
import BoxBreathingScreen from "./screens/BoxBreathingScreen";
import FourSevenEightBreathingScreen from "./screens/FourSevenEightBreathingScreen";
import AlternateNostrilBreathingScreen from "./screens/AlternateNostrilBreathingScreen";
import TriangleBreathingScreen from "./screens/TriangleBreathingScreen";
import BellowsBreathScreen from "./screens/BellowsBreathScreen";
import HummingBeeBreathScreen from "./screens/HummingBeeBreathScreen";
import OmChantingScreen from "./screens/OmChantingScreen";
import CandleGazingScreen from "./screens/CandleGazingScreen";
import SoHumMantraScreen from "./screens/SoHumMantraScreen";
import ShantiMantraScreen from "./screens/ShantiMantraScreen";
import GayatriMantraScreen from "./screens/GayatriMantraScreen";
import MrityunjayaMantraScreen from "./screens/MrityunjayaMantraScreen";
import TadasanaScreen from "./screens/TadasanaScreen";
import VrikshasanaScreen from "./screens/VrikshasanaScreen";
import BhujangasanaScreen from "./screens/BhujangasanaScreen";
import DownwardDogScreen from "./screens/DownwardDogScreen";
import PadmasanaScreen from "./screens/PadmasanaScreen";
import ShavasanaScreen from "./screens/ShavasanaScreen";
import TrikonasanaScreen from "./screens/TrikonasanaScreen";
import SuryaNamaskarScreen from "./screens/SuryaNamaskarScreen";
import UtkatasanaScreen from "./screens/UtkatasanaScreen";
import DhanurasanaScreen from "./screens/DhanurasanaScreen";
import { useLocalData } from "./hooks/useLocalData";
import PaschimottanasanaScreen from "./screens/PaschimottanasanaScreen";
import HalasanaScreen from "./screens/HalasanaScreen";

const Stack = createNativeStackNavigator();
const { height } = Dimensions.get("window");

export default function App() {
  const { initializeLocalData } = useLocalData();
  const [isConnected, setIsConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    initializeLocalData();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected;
      setIsConnected(connected);
      setShowModal(!connected);
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    const connected = state.isConnected;
    setIsConnected(connected);
    setShowModal(!connected);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="BoxBreathingScreen"
            component={BoxBreathingScreen}
          />
          <Stack.Screen
            name="FourSevenEightBreathingScreen"
            component={FourSevenEightBreathingScreen}
          />
          <Stack.Screen
            name="AlternateNostrilBreathingScreen"
            component={AlternateNostrilBreathingScreen}
          />
          <Stack.Screen
            name="TriangleBreathingScreen"
            component={TriangleBreathingScreen}
          />
          <Stack.Screen
            name="BellowsBreathScreen"
            component={BellowsBreathScreen}
          />
          <Stack.Screen
            name="HummingBeeBreathScreen"
            component={HummingBeeBreathScreen}
          />
          <Stack.Screen name="OmChantingScreen" component={OmChantingScreen} />
          <Stack.Screen
            name="CandleGazingScreen"
            component={CandleGazingScreen}
          />
          <Stack.Screen
            name="SoHumMantraScreen"
            component={SoHumMantraScreen}
          />
          <Stack.Screen
            name="ShantiMantraScreen"
            component={ShantiMantraScreen}
          />
          <Stack.Screen
            name="GayatriMantraScreen"
            component={GayatriMantraScreen}
          />
          <Stack.Screen
            name="MrityunjayaMantraScreen"
            component={MrityunjayaMantraScreen}
          />
          <Stack.Screen name="TadasanaScreen" component={TadasanaScreen} />
          <Stack.Screen
            name="VrikshasanaScreen"
            component={VrikshasanaScreen}
          />
          <Stack.Screen
            name="BhujangasanaScreen"
            component={BhujangasanaScreen}
          />
          <Stack.Screen
            name="DownwardDogScreen"
            component={DownwardDogScreen}
          />
          <Stack.Screen name="PadmasanaScreen" component={PadmasanaScreen} />
          <Stack.Screen name="ShavasanaScreen" component={ShavasanaScreen} />
          <Stack.Screen
            name="SuryaNamaskarScreen"
            component={SuryaNamaskarScreen}
          />
          <Stack.Screen
            name="TrikonasanaScreen"
            component={TrikonasanaScreen}
          />
          <Stack.Screen name="UtkatasanaScreen" component={UtkatasanaScreen} />
          <Stack.Screen
            name="DhanurasanaScreen"
            component={DhanurasanaScreen}
          />
          <Stack.Screen
            name="PaschimottanasanaScreen"
            component={PaschimottanasanaScreen}
          />
          <Stack.Screen name="HalasanaScreen" component={HalasanaScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* ⚡ No Internet Modal (with dark theme) */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.message}>
              Please check your internet settings and try again.
            </Text>

            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1C2526", // same dark color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    elevation: 10,
    minHeight: height * 0.25,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50", // same green as your close button
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
