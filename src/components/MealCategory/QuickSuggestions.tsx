// src/components/MealCategory/QuickSuggestions.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SelectedFoodItem } from "./SelectedFoods";

type Props = {
  category: string;
  onSelect: (food: SelectedFoodItem) => void;
};

const suggestionMap: Record<string, SelectedFoodItem[]> = {
  breakfast: [
    { id: "101", name: "Oats", calories: 150, protein: 5, carbs: 27, fats: 3 },
    { id: "102", name: "Banana", calories: 100, protein: 1, carbs: 25, fats: 0.3 },
    { id: "103", name: "Boiled Eggs", calories: 78, protein: 6, carbs: 0.6, fats: 5.3 },
  ],
  lunch: [
    { id: "201", name: "Rice", calories: 200, protein: 4, carbs: 45, fats: 1 },
    { id: "202", name: "Dal", calories: 130, protein: 8, carbs: 20, fats: 2 },
    { id: "203", name: "Grilled Chicken", calories: 220, protein: 30, carbs: 0, fats: 8 },
  ],
  dinner: [
    { id: "301", name: "Roti", calories: 120, protein: 3, carbs: 22, fats: 2 },
    { id: "302", name: "Paneer", calories: 200, protein: 14, carbs: 4, fats: 16 },
    { id: "303", name: "Salad", calories: 80, protein: 2, carbs: 10, fats: 4 },
  ],
  snacks: [
    { id: "401", name: "Nuts", calories: 170, protein: 6, carbs: 5, fats: 14 },
    { id: "402", name: "Fruits", calories: 90, protein: 1, carbs: 22, fats: 0.2 },
    { id: "403", name: "Yogurt", calories: 100, protein: 5, carbs: 10, fats: 3 },
  ],
};

const QuickSuggestions = ({ category, onSelect }: Props) => {
  const lowerCategory = category.toLowerCase();
  const suggestions = suggestionMap[lowerCategory] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Add Suggestions</Text>
      {suggestions.map((food) => (
        <TouchableOpacity key={food.id} onPress={() => onSelect(food)} style={styles.card}>
          <Text style={styles.name}>{food.name}</Text>
          <Text style={styles.details}>
            {food.calories} kcal | {food.protein}g P | {food.carbs}g C | {food.fats}g F
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickSuggestions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  details: {
    fontSize: 13,
    color: "#777",
  },
});