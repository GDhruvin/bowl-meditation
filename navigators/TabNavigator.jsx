import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SoundScreen from "../screens/SoundScreen";
import BreathingScreen from "../screens/BreathingScreen";
import MeditationScreen from "../screens/MeditationScreen";
import YogaScreen from "../screens/YogaScreen";
import InstrumentsIcon from "../icons/InstrumentsIcon";
import MeditationIcon from "../icons/MeditationIcon";
import SoundIcon from "../icons/SoundIcon";
import BreathingIcon from "../icons/BreathingIcon";
import YogasIcon from "../icons/YogasIcon";

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
          let IconComponent;

          if (route.name === "Instruments") {
            IconComponent = InstrumentsIcon;
          } else if (route.name === "Meditation") {
            IconComponent = MeditationIcon;
          } else if (route.name === "Sound") {
            IconComponent = SoundIcon;
          } else if (route.name === "Breathing") {
            IconComponent = BreathingIcon;
          } else if (route.name === "Yogas") {
            IconComponent = YogasIcon;
          }

          return <IconComponent focused={focused} color={color} size={size} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#A7B7B9",
      })}
    >
      <Tab.Screen name="Instruments" component={HomeScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Sound" component={SoundScreen} />
      <Tab.Screen name="Breathing" component={BreathingScreen} />
      <Tab.Screen name="Yogas" component={YogaScreen} />
    </Tab.Navigator>
  );
}
