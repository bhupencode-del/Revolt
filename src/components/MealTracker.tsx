import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import MealDetail from "../components/MealDetail"; // Adjust path as per your structure

// Type definitions
type FoodItem = {
  id: string;
  name: string;
  calories: number;
};

type Meal = {
  id: string;
  name: string;
  foods: FoodItem[];
};

// Mock food database (replace this later with API)
const mockFoodDatabase: FoodItem[] = [
  { id: '101', name: 'Boiled Egg', calories: 78 },
  { id: '102', name: 'Scrambled Egg', calories: 91 },
  { id: '103', name: 'Oats', calories: 150 },
  { id: '104', name: 'Chicken Breast', calories: 165 },
  { id: '105', name: 'Apple', calories: 95 },
];

const initialMeals: Meal[] = [
  { id: '1', name: 'Breakfast', foods: [] },
  { id: '2', name: 'Lunch', foods: [] },
  { id: '3', name: 'Dinner', foods: [] },
];

const MealTracker = () => {
  const [mealDetailVisible, setMealDetailVisible] = useState(false);
  const [selectedMealName, setSelectedMealName] = useState<string>('');

  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [snacks, setSnacks] = useState<Meal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = mockFoodDatabase.filter((food) =>
      food.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFoods(filtered);
  };

  const handleAddFoodToMeal = (food: FoodItem) => {
    const foodWithId = { ...food, id: Date.now().toString() };
    if (selectedMeal?.name === "Snack") {
      setSnacks((prev) =>
        prev.map((snack) =>
          snack.id === selectedMeal.id ? { ...snack, foods: [...snack.foods, foodWithId] } : snack
        )
      );
    } else {
      setMeals((prev) =>
        prev.map((meal) =>
          meal.id === selectedMeal?.id ? { ...meal, foods: [...meal.foods, foodWithId] } : meal
        )
      );
    }
    setModalVisible(false);
    setSearchText('');
  };

  const handleAddFood = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const handleAddSnack = () => {
    const newSnack: Meal = { id: Date.now().toString(), name: "Snack", foods: [] };
    setSnacks((prev) => [...prev, newSnack]);
  };

  const handleDeleteFood = (mealId: string, foodId: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId ? { ...meal, foods: meal.foods.filter((food) => food.id !== foodId) } : meal
      )
    );
    setSnacks((prev) =>
      prev.map((snack) =>
        snack.id === mealId ? { ...snack, foods: snack.foods.filter((food) => food.id !== foodId) } : snack
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meals & Calories</Text>

      {meals.map((meal) => (
        <TouchableOpacity key={meal.id} style={styles.mealCard} onPress={() => {setSelectedMealName(meal.name);setMealDetailVisible(true);}}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.caloriesText}>{meal.foods.reduce((sum, item) => sum + item.calories, 0)} kcal</Text>
            {meal.foods.map((food) => (
              <View key={food.id} style={styles.foodItemRow}>
                <Text style={styles.foodItem}>{food.name} - {food.calories} kcal</Text>
                <TouchableOpacity onPress={() => handleDeleteFood(meal.id, food.id)}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.snackTitle}>Snacks</Text>
      {snacks.map((snack, index) => (
        <TouchableOpacity key={snack.id} style={styles.mealCard} onPress={() => {setSelectedMealName(snack.name);setMealDetailVisible(true);}}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealName}>Snack {index + 1}</Text>
            <Text style={styles.caloriesText}>{snack.foods.reduce((sum, item) => sum + item.calories, 0)} kcal</Text>
            {snack.foods.map((food) => (
              <View key={food.id} style={styles.foodItemRow}>
                <Text style={styles.foodItem}>{food.name} - {food.calories} kcal</Text>
                <TouchableOpacity onPress={() => handleDeleteFood(snack.id, food.id)}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleAddSnack} style={styles.addSnackButton}><Text style={styles.addButtonText}>+ Add Snack</Text></TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Food</Text>
            <TextInput value={searchText} onChangeText={handleSearch} placeholder="Search for food" style={styles.input} />
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAddFoodToMeal(item)} style={styles.foodOption}>
                  <Text>{item.name}</Text>
                  <Text style={styles.foodOptionDetail}>{item.calories} kcal</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}><Text style={styles.modalButtonText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    <MealDetail
  visible={mealDetailVisible}
  mealName={selectedMealName}
  onClose={() => setMealDetailVisible(false)}
/>

    </View>
  );
};

const styles = StyleSheet.create({
    container: { padding: 15 },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#333" },
    mealCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
    mealName: { fontSize: 16, fontWeight: "600" },
    caloriesText: { fontSize: 14, color: "#555", marginBottom: 5 },
    foodItemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', marginBottom: 5 },
    foodItem: { fontSize: 14, color: "#555" },
    deleteText: { color: "red", fontWeight: "bold", marginLeft: 10 },
    addButton: { backgroundColor: "#F0F0F0", padding: 8, borderRadius: 8, height: 36, justifyContent: 'center' },
    addButtonText: { color: "#007AFF", fontWeight: "bold" },
    snackTitle: { marginTop: 20, fontSize: 18, fontWeight: "600", color: "#333" },
    addSnackButton: { marginTop: 10, backgroundColor: "#E5E5E5", padding: 12, borderRadius: 8, alignItems: "center" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", height: "60%" },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 },
    foodOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: 'row', justifyContent: 'space-between' },
    foodOptionDetail: { color: "#555" },
    closeButton: { marginTop: 10, backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
    modalButtonText: { color: "#fff", fontWeight: "700" },
  });

export default MealTracker;