import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";

type HabitType = {
  name: string;
  repeat: string;
  reminderTime: string;
  startDate: string;
  notes?: string;
};

const HabitCreatedScreen = () => {
  const router = useRouter();
  const [habit, setHabit] = useState<HabitType | null>(null);
  const [trackedDates, setTrackedDates] = useState<Set<string>>(new Set());
  const today = new Date().toISOString().split("T")[0];

  const fetchHabit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/habit`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setHabit(data);
    } catch (err) {
      console.error("Error fetching habit:", err);
    }
  };

  const fetchTrackedDates = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/habit/tracked-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setTrackedDates(new Set(data));
      }
    } catch (err) {
      console.error("Error fetching tracked dates:", err);
    }
  };

  const leaveHabit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/habit`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        router.replace("/create-habit");
      } else {
        Alert.alert("Error", "Could not delete habit.");
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  const trackHabit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/habit/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: today }),
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTrackedDates(new Set(data));
      }
    } catch (err) {
      console.error("Error tracking habit:", err);
    }
  };

  const getLast7Days = () => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  useEffect(() => {
    fetchHabit();
    fetchTrackedDates();
  }, []);

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.value}>Loading habit...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>📅 Your Habit Tracker</Text>

      <View style={styles.trackerContainer}>
        {getLast7Days().map((date) => {
          const isTracked = trackedDates.has(date);
          const isToday = date === today;
          const day = new Date(date).getDate();

          return (
            <View
              key={date}
              style={[
                styles.circle,
                isToday && styles.todayCircle,
                isTracked && styles.doneCircle,
              ]}
            >
              <Text
                style={[
                  styles.circleText,
                  isTracked && { color: "#fff" },
                ]}
              >
                {day.toString()}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Habit Name</Text>
        <Text style={styles.value}>{habit.name}</Text>

        <Text style={styles.label}>Repeat</Text>
        <Text style={styles.value}>{habit.repeat}</Text>

        <Text style={styles.label}>Reminder Time</Text>
        <Text style={styles.value}>{habit.reminderTime}</Text>

        <Text style={styles.label}>Start Date</Text>
        <Text style={styles.value}>
          {new Date(habit.startDate).toDateString()}
        </Text>

        {habit.notes ? (
          <>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{habit.notes}</Text>
          </>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.trackButton,
          trackedDates.has(today) && styles.trackButtonDisabled,
        ]}
        disabled={trackedDates.has(today)}
        onPress={trackHabit}
      >
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.trackButtonText}>
          {trackedDates.has(today) ? "Marked for Today" : "Mark as Done"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.leaveButton} onPress={leaveHabit}>
        <Text style={styles.leaveButtonText}>Leave Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HabitCreatedScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    flexGrow: 1,
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
    color: "#333",
  },
  trackerContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  doneCircle: {
    backgroundColor: "#4CAF50",
  },
  circleText: {
    color: "#333",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 30,
    elevation: 2,
  },
  label: {
    color: "#777",
    fontSize: 13,
    marginTop: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  trackButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
  },
  trackButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  leaveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FF5252",
    borderRadius: 30,
  },
  leaveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
