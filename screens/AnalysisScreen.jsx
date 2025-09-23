import React, { useState } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function AnalysisScreen() {
  const [localData, setLocalData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const stored = await AsyncStorage.getItem("appLocalData");
          if (stored) {
            setLocalData(JSON.parse(stored));
          } else {
            setLocalData({});
          }
        } catch (e) {
          console.error("❌ Failed to load local data:", e);
          setLocalData({});
        }
      };
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Analysis Exercises</Text>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.jsonText}>
          {JSON.stringify(localData, null, 2)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
  },
  jsonText: {
    color: "#fff",
    fontSize: 14,
  },
});
