import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (reminders: { [key in MealType]?: Date }) => void;
};

const SetReminderModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<{ [key in MealType]?: Date }>({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  const handleDeleteTime = (meal: MealType) => {
    const updated = { ...selectedTimes };
    delete updated[meal];
    setSelectedTimes(updated);
  };

  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
          <Text style={styles.title}>Set Reminders</Text>

          {mealTypes.map((meal) => (
            <View key={meal} style={styles.mealRow}>
              <Text style={styles.mealName}>{meal}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal(meal);
                  setTempTime(selectedTimes[meal] || new Date());
                  setShowTimePicker(true);
                }}
              >
                <Ionicons name="alarm-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>

              {selectedTimes[meal] && (
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>
                    {formatTime(selectedTimes[meal]!)}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteTime(meal)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#E53935"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Custom Time Picker Overlay */}
      {showTimePicker && (
        <View style={styles.fullBlackOverlay}>
          <View style={styles.timePickerWrapper}>
            <DateTimePicker
              mode="time"
              display="spinner"
              themeVariant="dark"
              value={tempTime}
              onChange={(event, date) => {
                if (event.type === "set" && date) {
                  setTempTime(date);
                }
              }}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (selectedMeal) {
                  setSelectedTimes({
                    ...selectedTimes,
                    [selectedMeal]: tempTime,
                  });
                }
                setShowTimePicker(false);
              }}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default SetReminderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  mealName: {
    fontSize: 14,
    color: "#333",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  fullBlackOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerWrapper: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});