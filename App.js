import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import TabNavigator from "./navigators/TabNavigator";
import BoxBreathingScreen from "./screens/BoxBreathingScreen";
import FourSevenEightBreathingScreen from "./screens/FourSevenEightBreathingScreen";
import AlternateNostrilBreathingScreen from "./screens/AlternateNostrilBreathingScreen";
import TriangleBreathingScreen from "./screens/TriangleBreathingScreen";
import BellowsBreathScreen from "./screens/BellowsBreathScreen";
import OmChantingScreen from "./screens/OmChantingScreen";
import CandleGazingScreen from "./screens/CandleGazingScreen";
import SoHumMantraScreen from "./screens/SoHumMantraScreen";
import ShantiMantraScreen from "./screens/ShantiMantraScreen";
import GayatriMantraScreen from "./screens/GayatriMantraScreen";
import MrityunjayaMantraScreen from "./screens/MrityunjayaMantraScreen";
import TadasanaScreen from "./screens/TadasanaScreen";
import VrikshasanaScreen from "./screens/VrikshasanaScreen";
import BhujangasanaScreen from "./screens/BhujangasanaScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
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
        <Stack.Screen name="OmChantingScreen" component={OmChantingScreen} />
        <Stack.Screen
          name="CandleGazingScreen"
          component={CandleGazingScreen}
        />
        <Stack.Screen name="SoHumMantraScreen" component={SoHumMantraScreen} />
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
        <Stack.Screen name="VrikshasanaScreen" component={VrikshasanaScreen} />
        <Stack.Screen
          name="BhujangasanaScreen"
          component={BhujangasanaScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
