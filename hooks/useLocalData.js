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

const DEFAULT_LOCAL_DATA = {
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

  const updateMeditationSession = async (exerciseName, duration = 0) => {
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      const parsed = storedData ? JSON.parse(storedData) : null;
      if (!parsed) return;

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const exercises = parsed.meditation.exercises || [];

      const existingIndex = exercises.findIndex((e) => e.name === exerciseName);

      if (existingIndex !== -1) {
        // Existing meditation exercise
        const existing = exercises[existingIndex];
        existing.totalDuration += duration;
        existing.lastUsed = new Date().toISOString();

        // Check if today's session already exists
        const todaySession = existing.sessionsByDate.find(
          (s) => s.date === today
        );

        if (todaySession) {
          todaySession.sessionCount += 1;
        } else {
          existing.sessionsByDate.push({ date: today, sessionCount: 1 });
        }

        exercises[existingIndex] = existing;
      } else {
        // New meditation exercise
        exercises.push({
          name: exerciseName,
          totalDuration: duration,
          lastUsed: new Date().toISOString(),
          sessionsByDate: [{ date: today, sessionCount: 1 }],
        });
      }

      parsed.meditation.exercises = exercises;

      await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
      console.log("✅ Meditation updated:", parsed.meditation.exercises);
    } catch (error) {
      console.error("❌ Failed to update meditation:", error);
    }
  };

  const updateYogaSession = async (exerciseName, duration = 0) => {
    try {
      const storedData = await AsyncStorage.getItem("appLocalData");
      const parsed = storedData ? JSON.parse(storedData) : null;
      if (!parsed) return;

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const exercises = parsed.yoga.exercises || [];

      const existingIndex = exercises.findIndex((e) => e.name === exerciseName);

      if (existingIndex !== -1) {
        const existing = exercises[existingIndex];
        existing.sessionCount += 1;
        existing.totalDuration += duration;
        existing.lastUsed = new Date().toISOString();
        if (!existing.dates.includes(today)) {
          existing.dates.push(today);
        }
        exercises[existingIndex] = existing;
      } else {
        exercises.push({
          name: exerciseName,
          sessionCount: 1,
          totalDuration: duration,
          lastUsed: new Date().toISOString(),
          dates: [today],
        });
      }

      parsed.yoga.exercises = exercises;

      await AsyncStorage.setItem("appLocalData", JSON.stringify(parsed));
      console.log("✅ Yoga updated:", parsed.yoga.exercises);
    } catch (error) {
      console.error("❌ Failed to update yoga:", error);
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

        // 🔹 update sessionsByDate
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
    updateMeditationSession,
    updateYogaSession,
    updateSession,
  };
};
