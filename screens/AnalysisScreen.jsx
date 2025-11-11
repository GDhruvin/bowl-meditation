import { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  BarChart,
  PieChart,
  LineChart,
  StackedBarChart,
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function AnalysisScreen() {
  const [localData, setLocalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  useFocusEffect(
    useCallback(() => {
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

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Section descriptions for the modal
  const sectionDescriptions = {
    "Session Counts by Category": {
      title: "Session Counts by Category",
      description:
        "This bar chart shows the total number of sessions completed for each category (Meditation, Breathing, Yoga). It helps you understand which type of activity you’ve performed most frequently.",
    },
    "Duration Distribution": {
      title: "Duration Distribution",
      description:
        "This pie chart displays the total duration (in minutes) spent on each category. It shows the proportion of time dedicated to Meditation, Breathing, and Yoga.",
    },
    "Sessions Over Time": {
      title: "Sessions Over Time",
      description:
        "This line chart tracks the number of sessions for each category over time, with dates on the x-axis. It helps you see trends in your activity frequency.",
    },
    "Sessions by Activity": {
      title: "Sessions by Activity",
      description:
        "This stacked bar chart breaks down the number of sessions for each activity within the Meditation, Breathing, and Yoga categories. Each bar represents a category, with segments showing individual activities.",
    },
    "Cumulative Duration Over Time": {
      title: "Cumulative Duration Over Time",
      description:
        "This area chart shows the cumulative duration (in minutes) for each category over time. It illustrates how your time spent on activities accumulates day by day.",
    },
    "Sessions by Day of Week": {
      title: "Sessions by Day of Week",
      description:
        "This donut chart displays the total number of sessions completed on each day of the week across all categories. It helps identify which days you’re most active.",
    },
    Meditation: {
      title: "Meditation",
      description:
        "This section lists details about your meditation activities, including session counts, total duration, last used date, and sessions by date. It provides a detailed breakdown of your meditation practice.",
    },
    Breathing: {
      title: "Breathing",
      description:
        "This section lists details about your breathing exercises, including session counts, total duration, last used date, and sessions by date. It provides a detailed breakdown of your breathing practice.",
    },
    Yoga: {
      title: "Yoga",
      description:
        "This section lists details about your yoga sessions, including session counts, total duration, last used date, and sessions by date. It provides a detailed breakdown of your yoga practice.",
    },
  };

  const openModal = (sectionTitle) => {
    setModalContent(
      sectionDescriptions[sectionTitle] || {
        title: sectionTitle,
        description: "No description available.",
      }
    );
    setModalVisible(true);
  };

  const prepareChartData = () => {
    if (!localData) return null;

    // Bar chart: Total session counts per category
    const barData = {
      labels: ["Meditation", "Breathing", "Yoga"],
      datasets: [
        {
          data: [
            localData.meditation?.reduce(
              (sum, item) => sum + item.sessionCount,
              0
            ) || 0,
            localData.breathing?.reduce(
              (sum, item) => sum + item.sessionCount,
              0
            ) || 0,
            localData.yoga?.reduce((sum, item) => sum + item.sessionCount, 0) ||
              0,
          ],
        },
      ],
    };

    // Pie chart: Total duration distribution
    const pieData = [
      {
        name: "Meditation",
        duration:
          localData.meditation?.reduce(
            (sum, item) => sum + item.totalDuration,
            0
          ) || 0,
        color: "#4CAF50",
        legendFontColor: "#B0BEC5",
        legendFontSize: 14,
      },
      {
        name: "Breathing",
        duration:
          localData.breathing?.reduce(
            (sum, item) => sum + item.totalDuration,
            0
          ) || 0,
        color: "#2196F3",
        legendFontColor: "#B0BEC5",
        legendFontSize: 14,
      },
      {
        name: "Yoga",
        duration:
          localData.yoga?.reduce((sum, item) => sum + item.totalDuration, 0) ||
          0,
        color: "#FF9800",
        legendFontColor: "#B0BEC5",
        legendFontSize: 14,
      },
    ].filter((item) => item.duration > 0);

    // Line chart: Sessions over time
    const dates = Array.from(
      new Set([
        ...(localData.meditation?.flatMap((item) =>
          item.sessionsByDate.map((s) => s.date)
        ) || []),
        ...(localData.breathing?.flatMap((item) =>
          item.sessionsByDate.map((s) => s.date)
        ) || []),
        ...(localData.yoga?.flatMap((item) =>
          item.sessionsByDate.map((s) => s.date)
        ) || []),
      ])
    ).sort();

    const lineData = {
      labels: dates.map((d) => d.slice(5, 10)), // Show MM-DD
      datasets: [
        {
          data: localData["meditation"].length
            ? dates.map((date) =>
                localData.meditation?.reduce(
                  (sum, item) =>
                    sum +
                    (item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0),
                  0
                )
              )
            : [0],
          color: () => "#4CAF50",
          strokeWidth: 2,
          label: "Meditation",
        },
        {
          data: localData["breathing"].length
            ? dates.map((date) =>
                localData.breathing?.reduce(
                  (sum, item) =>
                    sum +
                    (item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0),
                  0
                )
              )
            : [0],
          color: () => "#2196F3",
          strokeWidth: 2,
          label: "Breathing",
        },
        {
          data: localData["yoga"].length
            ? dates.map((date) =>
                localData.yoga?.reduce(
                  (sum, item) =>
                    sum +
                    (item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0),
                  0
                )
              )
            : [0],
          color: () => "#FF9800",
          strokeWidth: 2,
          label: "Yoga",
        },
      ],
      legend: ["Meditation", "Breathing", "Yoga"],
    };

    // Stacked Bar Chart: Sessions by activity within each category
    const stackedBarData = {
      labels: ["Meditation", "Breathing", "Yoga"],
      legend: [],
      data: [
        localData.meditation?.map((item) => item.sessionCount) || [0],
        localData.breathing?.map((item) => item.sessionCount) || [0],
        localData.yoga?.map((item) => item.sessionCount) || [0],
      ],
      barColors: [
        "#4CAF50",
        "#66BB6A",
        "#81C784",
        "#2196F3",
        "#42A5F5",
        "#FF9800",
        "#FFB300",
        "#FFCA28",
      ],
    };

    // Area Chart (using LineChart with fill): Cumulative duration over time
    const areaData = {
      labels: dates.map((d) => d.slice(5, 10)),
      datasets: [
        {
          data: localData["meditation"].length
            ? dates.reduce((acc, date, idx) => {
                const prev = idx > 0 ? acc[idx - 1] : 0;
                const daily = localData.meditation?.reduce(
                  (sum, item) =>
                    sum +
                    ((item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0) *
                      item.totalDuration) /
                      item.sessionCount,
                  0
                );
                return [...acc, prev + (daily || 0)];
              }, [])
            : [0],
          color: () => "#4CAF50",
          strokeWidth: 2,
          label: "Meditation",
        },
        {
          data: localData["breathing"].length
            ? dates.reduce((acc, date, idx) => {
                const prev = idx > 0 ? acc[idx - 1] : 0;
                const daily = localData.breathing?.reduce(
                  (sum, item) =>
                    sum +
                    ((item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0) *
                      item.totalDuration) /
                      item.sessionCount,
                  0
                );
                return [...acc, prev + (daily || 0)];
              }, [])
            : [0],
          color: () => "#2196F3",
          strokeWidth: 2,
          label: "Breathing",
        },
        {
          data: localData["yoga"].length
            ? dates.reduce((acc, date, idx) => {
                const prev = idx > 0 ? acc[idx - 1] : 0;
                const daily = localData.yoga?.reduce(
                  (sum, item) =>
                    sum +
                    ((item.sessionsByDate.find((s) => s.date === date)
                      ?.sessionCount || 0) *
                      item.totalDuration) /
                      item.sessionCount,
                  0
                );
                return [...acc, prev + (daily || 0)];
              }, [])
            : [0],
          color: () => "#FF9800",
          strokeWidth: 2,
          label: "Yoga",
        },
      ],
      legend: ["Meditation", "Breathing", "Yoga"],
    };

    // Donut Chart: Sessions by day of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const donutData = daysOfWeek
      .map((day, index) => {
        const meditationSessions =
          localData.meditation?.reduce(
            (sum, item) =>
              sum +
              item.sessionsByDate.reduce(
                (s, session) =>
                  s +
                  (new Date(session.date).getDay() === index
                    ? session.sessionCount
                    : 0),
                0
              ),
            0
          ) || 0;
        const breathingSessions =
          localData.breathing?.reduce(
            (sum, item) =>
              sum +
              item.sessionsByDate.reduce(
                (s, session) =>
                  s +
                  (new Date(session.date).getDay() === index
                    ? session.sessionCount
                    : 0),
                0
              ),
            0
          ) || 0;
        const yogaSessions =
          localData.yoga?.reduce(
            (sum, item) =>
              sum +
              item.sessionsByDate.reduce(
                (s, session) =>
                  s +
                  (new Date(session.date).getDay() === index
                    ? session.sessionCount
                    : 0),
                0
              ),
            0
          ) || 0;
        return {
          name: day,
          sessions: meditationSessions + breathingSessions + yogaSessions,
          color: `hsl(${(index * 360) / 7}, 70%, 50%)`,
          legendFontColor: "#B0BEC5",
          legendFontSize: 14,
        };
      })
      .filter((item) => item.sessions > 0);

    return { barData, pieData, lineData, stackedBarData, areaData, donutData };
  };

  const renderSection = (title, data) => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={() => openModal(title)}>
              <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <Text style={styles.noDataText}>
            No {title.toLowerCase()} data available
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={() => openModal(title)}>
            <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {data.map((item, index) => (
            <View
              key={index}
              style={[styles.itemContainer, { width: 280, marginRight: 16 }]}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>
                Sessions:{" "}
                <Text style={{ color: "#4CAF50" }}>{item.sessionCount}</Text>
              </Text>
              <Text style={styles.itemDetail}>
                Total Duration:{" "}
                <Text style={{ color: "#2196F3" }}>
                  {item.totalDuration} min
                </Text>
              </Text>
              <Text style={styles.itemDetail}>
                Last Used:{" "}
                <Text style={{ color: "#FF9800" }}>
                  {formatDate(item.lastUsed)}
                </Text>
              </Text>
              <View style={styles.sessionsByDate}>
                <Text style={styles.subHeader}>Sessions by Date:</Text>
                {item.sessionsByDate.map((session, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.sessionDetail,
                      { color: idx % 2 === 0 ? "#B0BEC5" : "#90CAF9" },
                    ]}
                  >
                    {session.date}: {session.sessionCount} session
                    {session.sessionCount > 1 ? "s" : ""}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const chartConfig = {
    backgroundGradientFrom: "#2A3439",
    backgroundGradientTo: "#2A3439",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#1C2526",
    },
    fillShadowGradientOpacity: 0.6,
  };

  const chartData = localData ? prepareChartData() : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Analysis Exercises</Text>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {localData && chartData ? (
          <>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>
                  Session Counts by Category
                </Text>
                <TouchableOpacity
                  onPress={() => openModal("Session Counts by Category")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <BarChart
                data={chartData.barData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  barPercentage: 0.3,
                  fillShadowGradient: "#4CAF50",
                  fillShadowGradientOpacity: 1,
                }}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
              />
            </View>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Duration Distribution</Text>
                <TouchableOpacity
                  onPress={() => openModal("Duration Distribution")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <PieChart
                data={chartData.pieData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="duration"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Sessions Over Time</Text>
                <TouchableOpacity
                  onPress={() => openModal("Sessions Over Time")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <LineChart
                data={chartData.lineData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                bezier
              />
            </View>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Sessions by Activity</Text>
                <TouchableOpacity
                  onPress={() => openModal("Sessions by Activity")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <StackedBarChart
                data={chartData.stackedBarData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  barPercentage: 0.3,
                }}
                showValuesOnTopOfBars={false}
                style={styles.chart}
              />
            </View>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>
                  Cumulative Duration Over Time
                </Text>
                <TouchableOpacity
                  onPress={() => openModal("Cumulative Duration Over Time")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <LineChart
                data={chartData.areaData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  fillShadowGradient: "#4CAF50",
                  fillShadowGradientOpacity: 0.3,
                }}
                style={styles.chart}
                bezier
              />
            </View>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Sessions by Day of Week</Text>
                <TouchableOpacity
                  onPress={() => openModal("Sessions by Day of Week")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
              <PieChart
                data={chartData.donutData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="sessions"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend
                center={[10, 10]}
                donut
              />
            </View>
            {renderSection("Meditation", localData.meditation)}
            {renderSection("Breathing", localData.breathing)}
            {renderSection("Yoga", localData.yoga)}
          </>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
      </ScrollView>

      {/* Modal for Section Information */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalDescription}>
              {modalContent.description}
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: "#2A3439",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 14,
    color: "#B0BEC5",
    marginBottom: 4,
  },
  sessionsByDate: {
    marginTop: 8,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
  sessionDetail: {
    fontSize: 14,
    color: "#B0BEC5",
  },
  noDataText: {
    fontSize: 16,
    color: "#B0BEC5",
    textAlign: "center",
    marginTop: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  itemContainer: {
    backgroundColor: "#2A3439",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 600,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#2A3439",
    borderRadius: 12,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#B0BEC5",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
