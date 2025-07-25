import { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import BowlComponent from "../component/bowlComponent";
import BellComponent from "../component/bellComponent";
import HandPanComponent from "../component/handPanComponent";

export default function HomeScreen() {
  const instruments = [
    {
      id: "1",
      name: "Bowl",
      image: require("../assets/bowl.png"),
    },
    {
      id: "2",
      name: "Bell",
      image: require("../assets/bell.png"),
    },
    {
      id: "3",
      name: "Hande Pan",
      image: require("../assets/handpan.jpg"),
    },
    {
      id: "4",
      name: "Bowl",
      image: require("../assets/bowl.png"),
    },
    {
      id: "5",
      name: "Bell",
      image: require("../assets/bell.png"),
    },
    {
      id: "6",
      name: "Hande Pan",
      image: require("../assets/handpan.jpg"),
    },
    {
      id: "7",
      name: "Bowl",
      image: require("../assets/bowl.png"),
    },
    {
      id: "8",
      name: "Bell",
      image: require("../assets/bell.png"),
    },
    {
      id: "9",
      name: "Hande Pan",
      image: require("../assets/handpan.jpg"),
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
      default:
        return null;
    }
  };

  const renderInstrument = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedInstrument(item);
      }}
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
          {renderInstrumentComponent()}

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
