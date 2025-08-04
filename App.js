import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import TabNavigator from "./navigators/TabNavigator";
import BoxBreathingScreen from "./screens/BoxBreathingScreen";
import FourSevenEightBreathingScreen from "./screens/FourSevenEightBreathingScreen";
import AlternateNostrilBreathingScreen from "./screens/AlternateNostrilBreathingScreen";
import TriangleBreathingScreen from "./screens/TriangleBreathingScreen";
import BellowsBreathScreen from "./screens/BellowsBreathScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
