import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


const fitnessGoals = [
  { id: 1, title: "Lose Weight", image: require("../../assets/images/lose_weight.png") },
  { id: 2, title: "Gain Muscle", image: require("../../assets/images/gain_muscle.png") },
  { id: 3, title: "Improve Stamina", image: require("../../assets/images/improve_stamina.png") },
  { id: 4, title: "Eat Healthier", image: require("../../assets/images/eat_healthier.png") },
  { id: 5, title: "Maintain Fitness", image: require("../../assets/images/maintain_fitness.png") },
  { id: 6, title: "Health Improvement", image: require("../../assets/images/health_improvement.png") },
];

const FitnessGoalsScreen = () => {
  const router = useRouter();
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  const handleNext = async () => {
    if (!selectedGoalId) {
      Alert.alert("Please select a goal before continuing");
      return;
    }

    const selectedGoal = fitnessGoals.find(goal => goal.id === selectedGoalId)?.title;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fitnessGoal: selectedGoal }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/fitnessLevel");
      } else {
        console.log("API error:", data);
        Alert.alert("Error", data.message || "Failed to save goal");
      }
    } catch (error) {
      console.error("Error updating fitness goal:", error);
      Alert.alert("Error", "Something went wrong while saving your goal.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>Page 1 of 4</Text>
      </View>

      {/* ✅ Title */}
      <Text style={styles.title}>What’s your main fitness goal?</Text>

      {/* ✅ Goal Options */}
      <FlatList
        data={fitnessGoals}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.goalBox, selectedGoalId === item.id && styles.selectedGoal]}
            onPress={() => setSelectedGoalId(item.id)}
          >
            <Image source={item.image} style={styles.goalImage} />
            <Text style={[styles.goalText, selectedGoalId === item.id && styles.selectedText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ✅ Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>NEXT</Text>
        <AntDesign name="arrowright" size={22} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default FitnessGoalsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F5FC", alignItems: "center", padding: 20 },

  progressContainer: { width: "90%", alignItems: "center", marginVertical: 15 },
  progressBar: { width: "100%", height: 10, borderRadius: 10, backgroundColor: "#D0D0D0", overflow: "hidden" },
  progressFill: { width: "25%", height: "100%", backgroundColor: "#007AFF", borderRadius: 10 },
  progressText: { marginTop: 10, fontSize: 14, color: "#333", fontFamily: "Poppins-SemiBold" },

  title: { fontSize: 18, fontFamily: "Poppins-SemiBold", color: "#1C1B1B", marginBottom: 15, textAlign: "center" },

  row: { flex: 1, justifyContent: "space-between", marginBottom: 15 },
  goalBox: {
    width: 160, height: 180, borderRadius: 15,
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
    padding: 10, marginHorizontal: 10, borderWidth: 2, borderColor: "#FFFFFF",
    shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 2, height: 4 }, elevation: 4,
  },
  selectedGoal: { borderColor: "#007AFF", borderWidth: 3 },
  goalImage: { width: "100%", height: "100%", resizeMode: "cover", borderRadius: 12 },
  goalText: {
    fontSize: 11, fontFamily: "Poppins-Medium", textAlign: "center", color: "#333",
    position: "absolute", bottom: 6, backgroundColor: "rgba(255,255,255,0.8)",
    padding: 4, borderRadius: 6, width: "90%",
  },
  selectedText: { color: "#007AFF" },

  nextButton: {
    width: "100%", flexDirection: "row", backgroundColor: "#4CAF50",
    paddingVertical: 16, borderRadius: 14, justifyContent: "center",
    alignItems: "center", marginTop: 10, shadowColor: "#000",
    shadowOpacity: 0.2, shadowOffset: { width: 2, height: 4 },
  },
  nextText: { fontSize: 18, fontWeight: "bold", color: "white", fontFamily: "Poppins-SemiBold" },
  arrowIcon: { marginLeft: 10 },
});
