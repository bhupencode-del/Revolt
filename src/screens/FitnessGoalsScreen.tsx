import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Image
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // For arrow icon

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
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((goal) => goal !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      
      {/* ✅ Modern Progress Bar (Page 1 of 4) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} /> {/* Active progress */}
        </View>
        <Text style={styles.progressText}>Page 1 of 4</Text>
      </View>

      {/* ✅ Title */}
      <Text style={styles.title}>What’s your main fitness goal?</Text>

      {/* ✅ Fitness Goals Grid */}
      <FlatList
        data={fitnessGoals}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.goalBox, selectedGoals.includes(item.id) && styles.selectedGoal]}
            onPress={() => toggleSelection(item.id)}
          >
            {/* ✅ Image fills the entire box */}
            <Image source={item.image} style={styles.goalImage} />

            {/* ✅ Goal Text */}
            <Text style={[styles.goalText, selectedGoals.includes(item.id) && styles.selectedText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ✅ Next Button (Blue) */}
      <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/fitnessLevel")}>
        <Text style={styles.nextText}>NEXT</Text>
        <AntDesign name="arrowright" size={22} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F5FC", alignItems: "center", padding: 20 },

  // ✅ Modern Progress Bar
  progressContainer: { 
    width: "90%", 
    alignItems: "center", 
    marginVertical: 15 
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D0D0D0",
    overflow: "hidden",
  },
  progressFill: {
    width: "25%", // 25% since it's Page 1 of 4
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },

  // ✅ Title Styling
  title: { fontSize: 18, fontWeight: "regular", color: "#1C1B1B", marginBottom: 10, textAlign: "center" },

  // ✅ Fitness Goals Grid with Proper Spacing
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 15, // Added spacing between rows
  },
  goalBox: {
    width: 160, // Consistent width
    height: 180, // Adjusted height
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 10, // ✅ Added space between boxes
    borderWidth: 2, // ✅ Border added for selection effect
    borderColor: "#FFFFFF", // Default color (no selection)
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 2, height: 4 },
    elevation: 4, // For Android shadow
  },
  selectedGoal: {
    borderColor: "#007AFF", // ✅ Border color changes when selected
    borderWidth: 3,
  },

  // ✅ Image fills the entire box
  goalImage: {
    width: "100%", // ✅ Matches box size
    height: "100%", // ✅ Proper scaling
    resizeMode: "cover", // ✅ Makes the image cover the entire box
    borderRadius: 12, // ✅ Soft edges
  },

  // ✅ Goal Text with Font Size 10
  goalText: { 
    fontSize: 10, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#333",
    position: "absolute", // ✅ Positioned over the image
    bottom: 5, // ✅ Proper positioning
    backgroundColor: "rgba(255, 255, 255, 0.7)", // ✅ Semi-transparent background for visibility
    padding: 3, 
    borderRadius: 5, 
    width: "90%", 
  },
  selectedText: { color: "#007AFF" }, // ✅ Selected text color

  // ✅ Next Button (Blue & Matches UI Flow)
  nextButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#4DCFFF",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  nextText: { fontSize: 18, fontWeight: "bold", color: "white" },
  arrowIcon: { marginLeft: 10 }, // Space between text & icon
});

export default FitnessGoalsScreen;
