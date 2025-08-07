import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SoundScreen from "../screens/SoundScreen";
import BreathingScreen from "../screens/BreathingScreen";
import MeditationScreen from "../screens/MeditationScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerStyle: {
          backgroundColor: "#1C2526",
          borderBottomColor: "#2E3A3B",
        },
        headerTintColor: "#E0E7E9",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "#1C2526",
          borderTopColor: "#2E3A3B",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Instruments") {
            iconName = focused ? "radio" : "radio-outline";
          } else if (route.name === "Meditation") {
            iconName = focused ? "medkit" : "medkit-outline";
          } else if (route.name === "Sound") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (route.name === "Breathing") {
            iconName = focused ? "leaf" : "leaf-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#A7B7B9",
      })}
    >
      <Tab.Screen name="Instruments" component={HomeScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Sound" component={SoundScreen} />
      <Tab.Screen name="Breathing" component={BreathingScreen} />
    </Tab.Navigator>
  );
}
