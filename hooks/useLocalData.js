import AsyncStorage from "@react-native-async-storage/async-storage";

const INSTRUMENT_KEYS = {
  hasUsed_Bell: false,
  hasUsed_Bowl: false,
  hasUsed_Gong: false,
  hasUsed_HandPan: false,
  hasUsed_OceanDrum: false,
  hasUsed_TuningFork: false,
  sessions: [],
};

export const DEFAULT_LOCAL_DATA = {
  instrument: {
    hasUsed_Bell: true,
    hasUsed_Bowl: true,
    hasUsed_Gong: true,
    hasUsed_HandPan: true,
    hasUsed_OceanDrum: true,
    hasUsed_TuningFork: true,
    sessions: [],
  },
  meditation: [],
  breathing: [],
  yoga: [],
};

export const useLocalData = () => {
  const updateInstrument = async (key, value) => {
    if (!INSTRUMENT_KEYS.hasOwnProperty(key)) return;
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      const parsed = storedData ? JSON.parse(storedData) : { instrument: {} };
      parsed["instrument"][key] = value;
      await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to update local data:", error);
    }
  };

  const initializeLocalData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");

      if (!storedData) {
        // First time initialization
        const initialData = {
          ...DEFAULT_LOCAL_DATA,
          lastResetMonth: new Date().getMonth(), // track month
        };
        await AsyncStorage.setItem("appLocalData", JSON.stringify(initialData));
      } else {
        let parsed = JSON.parse(storedData);
        const currentMonth = new Date().getMonth();

        // If data does not have month info, initialize it
        if (parsed.lastResetMonth === undefined) {
          parsed.lastResetMonth = currentMonth;
          await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
          console.log("Added lastResetMonth field ✅");
        }

        // 🔹 Reset meditation, breathing, yoga when month changes
        if (parsed.lastResetMonth !== currentMonth) {
          parsed = {
            ...parsed,
            meditation: [],
            breathing: [],
            yoga: [],
            lastResetMonth: currentMonth, // update month
          };
          await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
          console.log("Monthly reset done ✅");
        } else {
          console.log("appLocalData already exists for this month ✅");
        }
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

  const updateSession = async (category, exerciseName, duration = 0) => {
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      const parsed = storedData ? JSON.parse(storedData) : {};

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const exercises = parsed[category] || [];

      const existingIndex = exercises.findIndex((e) => e.name === exerciseName);

      if (existingIndex !== -1) {
        const existing = exercises[existingIndex];
        existing.sessionCount += 1;
        existing.totalDuration += duration;
        existing.lastUsed = new Date().toISOString();

        if (!existing.sessionsByDate) existing.sessionsByDate = [];
        const dateIndex = existing.sessionsByDate.findIndex(
          (d) => d.date === today
        );
        if (dateIndex !== -1) {
          existing.sessionsByDate[dateIndex].sessionCount += 1;
        } else {
          existing.sessionsByDate.push({ date: today, sessionCount: 1 });
        }

        exercises[existingIndex] = existing;
      } else {
        exercises.push({
          name: exerciseName,
          sessionCount: 1,
          totalDuration: duration,
          lastUsed: new Date().toISOString(),
          sessionsByDate: [{ date: today, sessionCount: 1 }],
        });
      }

      parsed[category] = exercises;

      await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
      console.log(`✅ ${category} updated:`, parsed[category]);
    } catch (error) {
      console.error(`❌ Failed to update ${category}:`, error);
    }
  };

  return {
    updateInstrument,
    initializeLocalData,
    clearAll,
    updateSession,
  };
};
