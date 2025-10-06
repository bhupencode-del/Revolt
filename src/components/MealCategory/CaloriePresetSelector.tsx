import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


interface Props {
  value: string;
  onChange: (val: string) => void;
}

const CaloriePresetSelector: React.FC<Props> = ({ value, onChange }) => {
  const [gender, setGender] = useState<"male" | "female">("male");

  useEffect(() => {
    const fetchGender = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.gender === "female" || data.gender === "male") {
          setGender(data.gender);
        }
      } catch (err) {
        console.error("Failed to fetch gender:", err);
      }
    };

    fetchGender();
  }, []);

  const getCalories = (preset: string) => {
    const base = gender === "female" ? 1600 : 2000;
    switch (preset) {
      case "weight_loss":
        return base;
      case "maintenance":
        return base + 400;
      case "muscle_gain":
        return base + 800;
      default:
        return base;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Choose a Preset</Text>
      <Text style={styles.genderText}>Gender: {gender === "female" ? "Female" : "Male"}</Text>
      <Text style={styles.calorieText}>
        Estimated Calories: {getCalories(value)} kcal/day
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          mode={Platform.OS === "android" ? "dropdown" : "dialog"}
          style={styles.picker}
        >
          <Picker.Item label="Weight Loss" value="weight_loss" />
          <Picker.Item label="Maintenance" value="maintenance" />
          <Picker.Item label="Muscle Gain" value="muscle_gain" />
        </Picker>
      </View>
    </View>
  );
};

export default CaloriePresetSelector;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  genderText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  calorieText: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    overflow: "hidden",
    justifyContent: "center",
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
});
