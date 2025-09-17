import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";
import HomeScreen from "../screens/HomeScreen";
import MeditationScreen from "../screens/MeditationScreen";
import BreathingScreen from "../screens/BreathingScreen";
import YogaScreen from "../screens/YogaScreen";
import AnalysisScreen from "../screens/AnalysisScreen";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        ...styles.shadow,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          borderColor: "#121212",
          backgroundColor: "#121212",
          borderRadius: 30,
          height: 80,
          paddingHorizontal: 10,
          ...styles.shadow,
        },
        tabBarIcon: ({ focused }) => {
          let iconName, label;

          if (route.name === "Instruments") {
            iconName = require("../icons/instruments.png");
            label = "Instruments";
          } else if (route.name === "Meditation") {
            iconName = require("../icons/meditation.png");
            label = "Meditation";
          } else if (route.name === "Analysis") {
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
                <Image
                  source={require("../icons/analysis.png")}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: "#fff",
                  }}
                />
              </MotiView>
            );
          } else if (route.name === "Breathing") {
            iconName = require("../icons/breathing.png");
            label = "Breathing";
          } else if (route.name === "Yogas") {
            iconName = require("../icons/yogas.png");
            label = "Yogas";
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <MotiView
                from={{ scale: 1 }}
                animate={{ scale: focused ? 1.3 : 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <Image
                  source={iconName}
                  resizeMode="contain"
                  style={{
                    width: route.name === "Yogas" ? 32 : 28,
                    height: route.name === "Yogas" ? 32 : 28,
                    tintColor: focused ? "#4CAF50" : "#A7B7B9",
                  }}
                />
              </MotiView>
              <Text
                style={{
                  color: focused ? "#4CAF50" : "#A7B7B9",
                  fontSize: 10,
                  fontWeight: "500",
                  marginTop: 4,
                  textAlign: "center",
                  width: 80,
                  numberOfLines: 1,
                  ellipsizeMode: "tail",
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Instruments" component={HomeScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen name="Breathing" component={BreathingScreen} />
      <Tab.Screen name="Yogas" component={YogaScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 105,
    elevation: 10,
  },
});
