import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width;

const macros = [
  { label: "Protein", consumed: 60, goal: 100, color: "#FF7043" }, // Orange
  { label: "Carbs", consumed: 150, goal: 200, color: "#66BB6A" }, // Green
  { label: "Fats", consumed: 40, goal: 70, color: "#29B6F6" }, // Blue
];

const caloriesConsumed = 1200;
const caloriesGoal = 1800;
const caloriePercentage = caloriesConsumed / caloriesGoal;

const NutritionSummary = () => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.sectionTitle}>Daily Calories</Text>

      {/* Calories Circular Progress */}
      <View style={styles.caloriesContainer}>
        <Progress.Circle
          size={130}
          progress={caloriePercentage}
          thickness={10}
          color="#4A90E2"
          unfilledColor="#ECECEC"
          borderWidth={0}
          showsText
          formatText={() => `${Math.round(caloriePercentage * 100)}%`}
          textStyle={styles.caloriePercent}
        />
        <Text style={styles.calorieLabel}>
          {caloriesConsumed} / {caloriesGoal} kcal
        </Text>
      </View>

      {/* Macros Circular Progress */}
      <View style={styles.macrosContainer}>
        {macros.map((macro, index) => {
          const percentage = macro.consumed / macro.goal;
          return (
            <View key={index} style={styles.macroItem}>
              <Progress.Circle
                size={85}
                progress={percentage}
                thickness={8}
                color={macro.color}
                unfilledColor="#ECECEC"
                borderWidth={0}
                showsText
                formatText={() => `${Math.round(percentage * 100)}%`}
                textStyle={styles.macroPercent}
              />
              <Text style={styles.macroLabel}>{macro.label}</Text>
              <Text style={styles.macroAmount}>
                {macro.consumed}g / {macro.goal}g
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
    textAlign: "left",
  },
  caloriesContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  caloriePercent: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  calorieLabel: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  macroItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  macroPercent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  macroLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  macroAmount: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});

export default NutritionSummary;
