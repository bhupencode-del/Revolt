import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


const fitnessLevels = [
  { id: 1, title: "Beginner", color: "#4CAF50", icon: "self-improvement" },
  { id: 2, title: "Intermediate", color: "#FFC107", icon: "fitness-center" },
  { id: 3, title: "Advanced", color: "#F44336", icon: "military-tech" },
];

const FitnessLevelScreen = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleNext = async () => {
    if (selectedLevel === null) return;

    const selectedTitle = fitnessLevels.find((level) => level.id === selectedLevel)?.title;
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "No token found");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fitnessLevel: selectedTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      router.push("/profileDetails");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Update Failed", "Something went wrong while updating fitness level.");
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* ✅ Progress Bar (Page 2 of 4) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Page 2 of 4</Text>
        </View>

        <Text style={styles.title}>What best describes your current fitness level?</Text>

        <FlatList
          data={fitnessLevels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.levelBox,
                selectedLevel === item.id && {
                  borderColor: item.color,
                  borderWidth: 3,
                  backgroundColor: item.color + '20',
                },
              ]}
              onPress={() => setSelectedLevel(item.id)}
            >
              <MaterialIcons name={item.icon} size={48} color={item.color} />
              <Text style={[styles.levelText, selectedLevel === item.id && { color: item.color }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: selectedLevel ? "#4CAF50" : "#A5D6A7" }]}
          onPress={handleNext}
          disabled={selectedLevel === null}
        >
          <Text style={styles.nextText}>NEXT</Text>
          <AntDesign name="arrowright" size={22} color="white" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F2F5FC",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  progressContainer: { width: "90%", alignItems: "center", marginVertical: 15 },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D0D0D0",
    overflow: "hidden",
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1C1B1B",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  levelBox: {
    width: 280,
    height: 120,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    elevation: 3,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    fontFamily: "Poppins-Medium",
  },
  nextButton: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  nextText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins-Medium",
  },
  arrowIcon: { marginLeft: 10 },
});

export default FitnessLevelScreen;
