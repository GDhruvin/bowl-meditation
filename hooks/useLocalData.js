import AsyncStorage from "@react-native-async-storage/async-storage";

const INSTRUMENT_KEYS = {
  hasUsed_Bell: false,
  hasUsed_Bowl: false,
  hasUsed_Gong: false,
  hasUsed_HandPan: false,
  hasUsed_OceanDrum: false,
  hasUsed_TuningFork: false,
};

const DEFAULT_LOCAL_DATA = {
  instrument: INSTRUMENT_KEYS,
};

export const useLocalData = () => {
  const updateInstrument = async (key, value) => {
    if (!INSTRUMENT_KEYS.hasOwnProperty(key)) return;
    setInstrument((prev) => ({ ...prev, [key]: value }));
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      const parsed = storedData ? JSON.parse(storedData) : { instrument: {} };
      parsed.instrument[key] = value;
      await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to update local data:", error);
    }
  };

  const initializeLocalData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      console.log("storedData", storedData);

      if (!storedData) {
        await AsyncStorage.setItem(
          "appLocalData",
          JSON.stringify(DEFAULT_LOCAL_DATA)
        );
        console.log("Initialized AsyncStorage with default local data ✅");
      } else {
        console.log("appLocalData already exists ✅");
      }
    } catch (error) {
      console.error("Failed to initialize AsyncStorage:", error);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      console.log("✅ AsyncStorage cleared");
    } catch (e) {
      console.error("Failed to clear AsyncStorage:", e);
    }
  };

  return { updateInstrument, initializeLocalData, clearAll };
};
