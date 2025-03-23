import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ useRouter from expo-router


// Define Ionicons types for strict TypeScript checks
type IoniconName = "barbell" | "restaurant" | "flame";

const NutritionBreakdown = ({ macros }: { macros: { protein: number, carbs: number, fats: number } }) => {
    const router = useRouter(); // Navigation hook
  const totalMacros = macros.protein + macros.carbs + macros.fats;

  const nutrients: { label: string; value: number; goal: number; color: string; icon: IoniconName }[] = [
    { label: "Protein", value: macros.protein, goal: 100, color: "#FF7043", icon: "barbell" },
    { label: "Carbs", value: macros.carbs, goal: 200, color: "#66BB6A", icon: "restaurant" },
    { label: "Fats", value: macros.fats, goal: 70, color: "#29B6F6", icon: "flame" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>

      {/* ✅ Total Macros Summary */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalValue}>{totalMacros}g</Text>
        <Text style={styles.totalLabel}>Total Macros</Text>
      </View>

      {/* 🔹 Macronutrient Progress Bars */}
      {nutrients.map((nutrient, index) => {
        const percentage = Math.min(nutrient.value / nutrient.goal, 1); // Max at 100%
        return (
          <View key={index} style={styles.nutrientRow}>
            <Ionicons name={nutrient.icon} size={22} color={nutrient.color} />
            <View style={styles.nutrientDetails}>
              <Text style={styles.nutrientLabel}>{nutrient.label}</Text>
              <Text style={styles.nutrientValue}>
                {nutrient.value}g / {nutrient.goal}g
              </Text>
            </View>
            <Progress.Bar
              progress={percentage}
              width={120}
              height={8}
              color={nutrient.color}
              unfilledColor="#E0E0E0"
              borderWidth={0}
              borderRadius={10}
            />
          </View>
        );
      })}

      {/* 🔎 View in Details Button */}
      <TouchableOpacity style={styles.detailsButton} onPress={() => router.push("/NutritionDetails")}>
        <Text style={styles.detailsButtonText}>View in Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    elevation: 3,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  nutrientDetails: {
    flex: 1,
    marginLeft: 10,
  },
  nutrientLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  nutrientValue: {
    fontSize: 12,
    color: "#777",
  },
  detailsButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default NutritionBreakdown;
