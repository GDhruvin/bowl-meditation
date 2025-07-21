import { useState, Suspense, lazy } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const BowlComponent = lazy(() => import("../component/bowlComponent"));
const BellComponent = lazy(() => import("../component/bellComponent"));
const HandPanComponent = lazy(() => import("../component/handPanComponent"));
const GongComponent = lazy(() => import("../component/GongComponent"));
const OceanDrumComponent = lazy(() =>
  import("../component/OceanDrumComponent")
);
const TuningForkComponent = lazy(() =>
  import("../component/TuningForkComponent")
);

export default function HomeScreen() {
  const instruments = [
    {
      id: "1",
      name: "Bowl",
      image: require("../assets/image/bowl.png"),
    },
    {
      id: "2",
      name: "Bell",
      image: require("../assets/image/bell.png"),
    },
    {
      id: "3",
      name: "Hande Pan",
      image: require("../assets/image/handpan.jpg"),
    },
    {
      id: "4",
      name: "Gong",
      image: require("../assets/image/gong.png"),
    },
    {
      id: "5",
      name: "Ocen Drum",
      image: require("../assets/image/ocean_drum.png"),
    },
    {
      id: "6",
      name: "Tuning Forks",
      image: require("../assets/image/tuning_forks.png"),
    },
  ];

  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);

  const renderInstrumentComponent = () => {
    switch (selectedInstrument.name) {
      case "Bowl":
        return <BowlComponent />;
      case "Bell":
        return <BellComponent />;
      case "Hande Pan":
        return <HandPanComponent />;
      case "Gong":
        return <GongComponent />;
      case "Ocen Drum":
        return <OceanDrumComponent />;
      case "Tuning Forks":
        return <TuningForkComponent />;
      default:
        return null;
    }
  };

  const renderInstrument = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedInstrument(item)}
      style={[
        styles.instrumentContainer,
        selectedInstrument.id === item.id && styles.selectedInstrument,
      ]}
    >
      <Image source={item.image} style={styles.instrumentImage} />
      <Text style={styles.instrumentName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Suspense
            fallback={<Text style={{ color: "#fff" }}>Loading...</Text>}
          >
            {renderInstrumentComponent()}
          </Suspense>

          <FlatList
            data={instruments}
            renderItem={renderInstrument}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.instrumentList}
            contentContainerStyle={styles.instrumentListContent}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C2526",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  instrumentList: {
    width: "100%",
    position: "absolute",
    bottom: 10,
  },
  instrumentListContent: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  instrumentContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
  },
  instrumentImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  instrumentName: {
    color: "#E0E7E9",
    marginTop: 5,
    fontSize: 14,
  },
  selectedInstrument: {
    backgroundColor: "#2E3A3B",
  },
});
