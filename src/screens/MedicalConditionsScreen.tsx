import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

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
      prev.includes(id) ? prev.filter((condition) => condition !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ Progress Bar (Page 4 of 4) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "100%" }]} />
        </View>
        <Text style={styles.progressText}>Page 4 of 4</Text>
      </View>

      {/* ✅ Title */}
      <Text style={styles.title}>Do you have any existing medical conditions?</Text>

      {/* ✅ Medical Conditions List (Scrollable) */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

      {/* ✅ Next Button (No Navigation Yet) */}
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F5FC", alignItems: "center", padding: 20 },

  // ✅ Progress Bar
  progressContainer: { width: "90%", alignItems: "center", marginVertical: 15 },
  progressBar: { width: "100%", height: 10, borderRadius: 10, backgroundColor: "#D0D0D0", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#007AFF", borderRadius: 10 },
  progressText: { marginTop: 10, fontSize: 14, color: "#333", fontWeight: "bold" },

  // ✅ Title
  title: { fontSize: 18, fontWeight: "regular", color: "#1C1B1B", marginBottom: 10, textAlign: "center" },

  // ✅ Scrollable Container
  scrollContainer: { width: "100%", alignItems: "center", paddingBottom: 20 },

  // ✅ Condition Box
  conditionBox: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  selectedCondition: { borderColor: "#007AFF", borderWidth: 2 },
  conditionText: { fontSize: 16, color: "#333" },
  selectedText: { color: "#007AFF", fontWeight: "bold" },

  // ✅ Next Button
  nextButton: {
    width: "100%",
    backgroundColor: "#4DCFFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default MedicalConditionsScreen;