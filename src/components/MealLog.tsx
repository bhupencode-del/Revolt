import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import LogMealModal from "@/components/LogMealModal";

// MealEntry Type
type MealEntry = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

// Meal categories
const mealCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

// Sample data for now
const sampleMealLogs: { [key: string]: MealEntry[] } = {
  "2024-03-16": [
    { name: "Breakfast", calories: 400, protein: 25, carbs: 50, fats: 10 },
    { name: "Lunch", calories: 600, protein: 40, carbs: 70, fats: 15 },
  ],
  "2024-03-15": [
    { name: "Dinner", calories: 550, protein: 35, carbs: 65, fats: 12 },
  ],
};

const MealLog = ({ selectedDate }: { selectedDate: string }) => {
  const [mealLogs, setMealLogs] = useState(sampleMealLogs);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const mealsForSelectedDate = mealLogs[selectedDate] || [];

  const handleAddMeal = (meal: MealEntry) => {
    const updatedLogs = {
      ...mealLogs,
      [selectedDate]: [...(mealLogs[selectedDate] || []), meal],
    };
    setMealLogs(updatedLogs);
    setModalVisible(false);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Log</Text>

      {mealCategories.map((category) => {
        const meals = mealsForSelectedDate.filter((m) => m.name === category);

        return (
          <View key={category} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => {
                  setSelectedCategory(category);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealDetails}>{meal.calories} kcal</Text>
                  <Text style={styles.mealDetails}>
                    {meal.protein}g P | {meal.carbs}g C | {meal.fats}g F
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMealsText}>No meals logged</Text>
            )}
          </View>
        );
      })}

      {/* Log Meal Modal */}
      <LogMealModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedCategory(null);
        }}
        onSave={handleAddMeal}
        category={selectedCategory || ""}
      />
    </View>
  );
};

export default MealLog;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  mealCard: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  addMealButton: {
    padding: 5,
  },
  mealItem: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  mealDetails: {
    fontSize: 12,
    color: "#777",
  },
  noMealsText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginBottom: 6,
  },
});
