import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePicker from "react-native-date-picker";
import { format } from "date-fns";
import * as Progress from "react-native-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";

import MealLog from "@/components/MealLog";
import SetReminderModal from "@/components/MealCategory/SetReminderModal";

type MealLogEntry = {
  mealType: string;
};

const MealTrackingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);

  const [progress] = useState(new Animated.Value(0));
  const [mealProgress, setMealProgress] = useState(0);
  const [mealStreak, setMealStreak] = useState(0);

  const router = useRouter();

  const fetchMealProgressAndStreak = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const [progressRes, streakRes] = await Promise.all([
        fetch(`${BASE_URL}/meal-log/today`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/meal-log/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const progressData = await progressRes.json();
      const streakData = await streakRes.json();

      const mealTypes = new Set();
      (progressData.meals as MealLogEntry[]).forEach((meal: any) => {
        mealTypes.add(meal.mealType);
      });

      const score = Math.min(mealTypes.size / 4, 1);
      setMealProgress(score);
      setMealStreak(streakData?.streak || 0);
    } catch (error) {
      console.error("Error fetching progress/streak:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMealProgressAndStreak();
    }, [])
  );

  useEffect(() => {
    Animated.timing(progress, {
      toValue: mealProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [mealProgress]);

  const formattedDate = format(selectedDate, "MMMM d, yyyy");

  const getCardStyle = (progress: number) => {
    if (progress === 1)
      return { backgroundColor: "#E8F5E9", borderColor: "#4CAF50" };
    if (progress >= 0.5)
      return { backgroundColor: "#FFF3E0", borderColor: "#FFA726" };
    return { backgroundColor: "#FFEBEE", borderColor: "#E53935" };
  };

  const getProgressColor = (progress: number) => {
    if (progress === 1) return "#4CAF50";
    if (progress >= 0.5) return "#FFA726";
    return "#E53935";
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress === 1) return "🔥 Amazing! You logged all meals today!";
    if (progress >= 0.75) return "💪 Almost there! Just one more meal.";
    if (progress >= 0.5) return "⚡ Keep going! You’re halfway done.";
    return "⏳ Start logging your meals for better tracking!";
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F9F9"
        translucent={false}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={styles.todayText}>Meal Tracking</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
              style={styles.iconSpacing}
            >
              <Ionicons name="calendar-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker Modal */}
        <Modal transparent visible={isDatePickerVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.datePickerBox}>
              <DatePicker
                date={selectedDate}
                mode="date"
                onDateChange={setSelectedDate}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDatePickerVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Streak Card */}
        {mealStreak > 0 ? (
          <View style={styles.streakCard}>
            <Text style={styles.streakTitle}>🔥 {mealStreak}-Day Meal Streak!</Text>
            <Text style={styles.streakSubtitle}>Keep going! Your consistency is impressive.</Text>
            <View style={styles.streakIcons}>
              {Array.from({ length: mealStreak }, (_, index) => (
                <Ionicons
                  key={index}
                  name="flame"
                  size={22}
                  color="#FF9800"
                  style={styles.streakIcon}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.streakCard}>
            <Text style={styles.streakTitle}>🚀 No Streak Yet</Text>
            <Text style={styles.streakSubtitle}>Start logging meals daily to build your streak!</Text>
          </View>
        )}

        {/* Progress Card */}
        <View style={[styles.consistencyCard, getCardStyle(mealProgress)]}>
          <Text style={styles.consistencyTitle}>Meal Logging Progress</Text>
          <View style={styles.progressContainer}>
            <Progress.Circle
              size={100}
              progress={mealProgress}
              color={getProgressColor(mealProgress)}
              unfilledColor="#E0E0E0"
              borderWidth={0}
              thickness={9}
            />
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressText, { color: getProgressColor(mealProgress) }]}>
                {Math.round(mealProgress * 4)}/4
              </Text>
              <Text style={styles.progressSubText}>Meals Logged</Text>
            </View>
          </View>
          <Text style={styles.consistencyMessage}>{getMotivationalMessage(mealProgress)}</Text>
        </View>

        {/* Meal Log */}
        <MealLog
          selectedDate={format(selectedDate, "yyyy-MM-dd")}
          onLogChange={fetchMealProgressAndStreak}
        />

        {/* Bottom Sheet */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={bottomSheetVisible}
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setBottomSheetVisible(false)}
          >
            <View style={styles.bottomSheet}>
              <Text style={styles.bottomSheetTitle}>Quick Options</Text>

              <TouchableOpacity
                style={styles.bottomOption}
                onPress={() => {
                  setBottomSheetVisible(false);
                  setReminderModalVisible(true);
                }}
              >
                <Ionicons name="alarm-outline" size={20} color="#4CAF50" />
                <Text style={styles.bottomOptionText}>Set Reminder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bottomOption}
                onPress={() => {
                  setBottomSheetVisible(false);
                  setReminderModalVisible(false);
                  setTimeout(() => {
                    router.push("/mealTracking/set-calorie-budget");
                  }, 300);
                }}
              >
                <Ionicons name="flame-outline" size={20} color="#F44336" />
                <Text style={styles.bottomOptionText}>Set Calorie Budget</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Set Reminder Modal */}
        <SetReminderModal
          visible={isReminderModalVisible}
          onClose={() => setReminderModalVisible(false)}
          onSave={(data) => {
            console.log("Saved Reminders:", data);
            setReminderModalVisible(false);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default MealTrackingScreen;

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: "#F9F9F9",
      },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 70 : 50, // ✅ This controls spacing from top
    marginBottom: 16,
  },  
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  todayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#777",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  streakCard: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9800",
  },
  streakSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  streakIcons: {
    flexDirection: "row",
    marginTop: 8,
  },
  streakIcon: {
    marginRight: 6,
  },
  consistencyCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  consistencyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTextContainer: {
    marginLeft: 16,
  },
  progressText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  progressSubText: {
    fontSize: 14,
    color: "#666",
  },
  consistencyMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  bottomOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  bottomOptionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
});
