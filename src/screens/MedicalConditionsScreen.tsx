// ✅ Final Step: Medical Conditions Screen with Backend Update Integration
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


const medicalConditions = [
  { id: 1, name: "None", icon: "❌" },
  { id: 2, name: "Diabetes", icon: "🩸" },
  { id: 3, name: "Thyroid", icon: "📊" },
  { id: 4, name: "PCOS/PCOD", icon: "🩺" },
  { id: 5, name: "Hypertension", icon: "📋" },
  { id: 6, name: "Cholesterol", icon: "💛" },
  { id: 7, name: "Physical Injury", icon: "🤕" },
  { id: 8, name: "Others", icon: "➕" },
];

const MedicalConditionsScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const router = useRouter();

  const toggleSelection = (id: number) => {
    setSelectedConditions((prev) =>
      prev.includes(id)
        ? prev.filter((condition) => condition !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const conditionText = selectedConditions
      .map((id) => medicalConditions.find((item) => item.id === id)?.name)
      .join(", ");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicalConditions: conditionText }),
      });

      const data = await res.json();
      if (res.ok) {
        router.replace("/home");
      } else {
        Alert.alert("Failed", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while submitting medical conditions:", error);
      Alert.alert("Error", "Could not update profile");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
          <Text style={styles.progressText}>Page 4 of 4</Text>
        </View>

        <Text style={styles.title}>Do you have any existing medical conditions?</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {medicalConditions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.conditionBox, selectedConditions.includes(item.id) && styles.selectedCondition]}
              onPress={() => toggleSelection(item.id)}
            >
              <Text style={[styles.conditionText, selectedConditions.includes(item.id) && styles.selectedText]}>
                {item.icon} {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextText}>FINISH</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F5FC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D0D0D0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#1C1B1B",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  conditionBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 12,
    alignItems: "center",
  },
  selectedCondition: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#E8F5E9",
  },
  conditionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  selectedText: {
    color: "#4CAF50",
    fontFamily: "Poppins-SemiBold",
  },
  nextButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  nextText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});

export default MedicalConditionsScreen;
