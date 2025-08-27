import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import BreathingScreen from "../screens/BreathingScreen";
import MeditationScreen from "../screens/MeditationScreen";
import YogaScreen from "../screens/YogaScreen";
import InstrumentsIcon from "../icons/InstrumentsIcon";
import MeditationIcon from "../icons/MeditationIcon";
import SoundIcon from "../icons/SoundIcon";
import BreathingIcon from "../icons/BreathingIcon";
import YogasIcon from "../icons/YogasIcon";
import { MotiView } from "moti";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C2526",
          borderTopColor: "#2E3A3B",
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
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

          return (
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: focused ? 1.3 : 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <IconComponent focused={focused} color={color} size={size} />
            </MotiView>
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#A7B7B9",
        tabBarLabelStyle: {
          fontSize: 10, // 👈 smaller font size
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name="Instruments" component={HomeScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Breathing" component={BreathingScreen} />
      <Tab.Screen name="Yogas" component={YogaScreen} />
    </Tab.Navigator>
  );
}
