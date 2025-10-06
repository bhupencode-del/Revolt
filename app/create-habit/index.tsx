import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/config/config";

const CreateHabitScreen = () => {
  const router = useRouter();

  const [habitName, setHabitName] = useState("");
  const [repeat, setRepeat] = useState("Daily");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert("Hold on!", "Please enter a habit name.");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
  
      const payload = {
        name: habitName,
        repeat,
        reminderTime: reminderTime.toTimeString().slice(0, 5), // HH:MM
        startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD
        notes,
      };
  
      const res = await fetch(`${BASE_URL}/habit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        console.log("✅ Habit created, navigating...");
        // Navigate without 'as any'
        router.replace("/habit-created");
      } else {
        const err = await res.json();
        console.log("❌ Error creating habit:", err);
        Alert.alert("Something went wrong", "Unable to create habit.");
      }
    } catch (err) {
      console.error("Habit creation error:", err);
    }
  };
  

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 🌿 Header */}
          <View style={styles.hero}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>🌿 Create a New Habit</Text>
            <Text style={styles.heroSub}>Make small changes that last long.</Text>
          </View>

          {/* ✍️ Inputs */}
          <View style={styles.card}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning Walk"
              value={habitName}
              onChangeText={setHabitName}
            />

            <Text style={styles.label}>Repeat</Text>
            <View style={styles.repeatRow}>
              {["Daily", "Weekly", "Custom"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.repeatOption,
                    repeat === item && styles.repeatOptionSelected,
                  ]}
                  onPress={() => setRepeat(item)}
                >
                  <Text
                    style={[
                      styles.repeatText,
                      repeat === item && styles.repeatTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Reminder Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {reminderTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                mode="time"
                value={reminderTime}
                is24Hour={false}
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) setReminderTime(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={startDate}
                display="calendar"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              multiline
              placeholder="Write something..."
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </ScrollView>

        {/* ✅ Fixed Save Button */}
        <View style={styles.saveWrapper}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
            <Text style={styles.saveButtonText}>Save Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateHabitScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  wrapper: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  hero: {
    marginTop: 10,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  heroSub: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 6,
    color: "#444",
  },
  input: {
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  repeatRow: {
    flexDirection: "row",
    gap: 10,
  },
  repeatOption: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },
  repeatOptionSelected: {
    backgroundColor: "#4CAF50",
  },
  repeatText: {
    fontSize: 13,
    color: "#555",
  },
  repeatTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  saveWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
