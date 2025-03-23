import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePicker from "react-native-date-picker";
import { format } from "date-fns";
import * as Progress from "react-native-progress";
import MealLog from "@/components/MealLog"; // ✅ Ensure MealLog.tsx exists
import NutritionBreakdown from "@/components/NutritionBreakdown"; // ✅ Import Nutrition Breakdown

const MealTrackingScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const formattedDate = format(selectedDate, "MMMM d, yyyy");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔙 Header with Back Button, Today’s Date, Calendar Icon & Three-Dot Menu */}
      <View style={styles.headerRow}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* Title and Date */}
        <View style={styles.headerTitle}>
          <Text style={styles.todayText}>Meal Tracking</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Right Side Icons */}
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.iconSpacing}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 📅 Date Picker Modal */}
      <Modal transparent={true} visible={isDatePickerVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.datePickerBox}>
            <DatePicker
              date={selectedDate}
              mode="date"
              onDateChange={(date) => setSelectedDate(date)}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setDatePickerVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Meal Consistency Score */}
      <View style={styles.consistencyCard}>
        <Text style={styles.consistencyTitle}>Meal Consistency Score</Text>
        <View style={styles.progressContainer}>
          <Progress.Circle
            size={90}
            progress={0.75}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            borderWidth={0}
            thickness={8}
          />
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>3/4</Text>
            <Text style={styles.progressSubText}>Meals Logged</Text>
          </View>
        </View>
        <Text style={styles.consistencyMessage}>🔥 Keep up the great work!</Text>
      </View>

      {/* 🍽️ Meal Log Section ✅ */}
      <MealLog selectedDate={format(selectedDate, "yyyy-MM-dd")} />

      {/* 🔥 Nutrition Breakdown ✅ */}
      <NutritionBreakdown macros={{ protein: 60, carbs: 150, fats: 40 }} />
    </ScrollView>
  );
};

export default MealTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  headerTitle: {
    alignItems: "center",
  },
  todayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 15,
  },
  consistencyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    elevation: 3,
    alignItems: "center",
  },
  consistencyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  progressTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressSubText: {
    fontSize: 10,
    color: "#888",
  },
  consistencyMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
