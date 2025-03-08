import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // For Next Button arrow

const fitnessLevels = [
  {
    id: 1,
    title: "Beginner",
    color: "#4CAF50", // Green
    image: require("../../assets/images/beginner.png"),
  },
  {
    id: 2,
    title: "Intermediate",
    color: "#FFC107", // Yellow
    image: require("../../assets/images/intermediate.png"),
  },
  {
    id: 3,
    title: "Advanced",
    color: "#F44336", // Red
    image: require("../../assets/images/advanced.png"),
  },
];

const FitnessLevelScreen = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      {/* ✅ Progress Bar (Page 2 of 4) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} /> {/* ✅ Active progress */}
        </View>
        <Text style={styles.progressText}>Page 2 of 4</Text>
      </View>

      {/* ✅ Title */}
      <Text style={styles.title}>What best describes your current fitness level?</Text>

      {/* ✅ Fitness Levels Grid */}
      <FlatList
        data={fitnessLevels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.levelBox,
              selectedLevel === item.id && { borderColor: item.color, borderWidth: 3 },
            ]}
            onPress={() => setSelectedLevel(item.id)}
          >
            <Image source={item.image} style={styles.levelImage} />
            <View style={styles.overlay}>
              <Text style={styles.levelText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ✅ Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => selectedLevel !== null && router.push("/profileDetails")}
        disabled={selectedLevel === null} // ✅ Disable if no selection
      >
        <Text style={styles.nextText}>NEXT</Text>
        <AntDesign name="arrowright" size={22} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F5FC", alignItems: "center", padding: 20 },

  // ✅ Progress Bar (Same as Fitness Goals Screen)
  progressContainer: { width: "90%", alignItems: "center", marginVertical: 15 },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D0D0D0",
    overflow: "hidden",
  },
  progressFill: {
    width: "50%", // ✅ 50% since it's Page 2 of 4
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  progressText: { marginTop: 10, fontSize: 14, color: "#333", fontWeight: "bold" },

  // ✅ Title Styling
  title: { fontSize: 18, fontWeight: "regular", color: "#1C1B1B", marginBottom: 15, textAlign: "center" },

  // ✅ Fitness Level Boxes (Properly visible with stretched images)
  levelBox: {
    width: 300, // ✅ Full width
    height: 180, // ✅ Increased height for larger box
    marginVertical: 15, // ✅ More space between boxes
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ddd", // Default border color
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    elevation: 4, // ✅ Android shadow
    overflow: "hidden", // ✅ Ensures image fills correctly
  },

  // ✅ Image fully fills the box
  levelImage: {
    width: "100%", // ✅ Image stretches fully inside
    height: "100%", // ✅ Covers full height of the box
    resizeMode: "cover", // ✅ Makes the image fit properly
  },

  // ✅ Overlay for Text inside the Box
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // ✅ Semi-transparent background
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },

  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // ✅ Next Button (Blue & Matches UI Flow)
  nextButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#4DCFFF",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  nextText: { fontSize: 18, fontWeight: "bold", color: "white" },
  arrowIcon: { marginLeft: 10 }, // ✅ Space between text & icon
});

export default FitnessLevelScreen;


