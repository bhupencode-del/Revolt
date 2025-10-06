// src/app/mealTracking/category.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  RefreshControl,
  FlatList,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import NutrientProgress from "@/components/MealCategory/NutrientProgress";
import SelectedFoods, { SelectedFoodItem } from "@/components/MealCategory/SelectedFoods";
import { NutritionData } from "@/types/NutritionData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


const CategoryScreen = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const [selectedFoods, setSelectedFoods] = useState<SelectedFoodItem[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SelectedFoodItem[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMealGoals = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/user/calorie-budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && category) {
        const meal = category.toString().toLowerCase();
        const totalCalories = data.totalCalories;
        const mealCalories = data.meals?.[meal] ?? 0;
        const ratio = mealCalories / totalCalories;

        const macros = {
          protein: Math.round(data.macros.protein * ratio),
          carbs: Math.round(data.macros.carbs * ratio),
          fats: Math.round(data.macros.fats * ratio),
          fiber: Math.round(25 * ratio),
        };

        setNutritionData([
          { label: "Calories", value: 0, goal: mealCalories, unit: "kcal", color: "#FF7043", icon: "fire" },
          { label: "Protein", value: 0, goal: macros.protein, unit: "g", color: "#4CAF50", icon: "food-drumstick" },
          { label: "Carbs", value: 0, goal: macros.carbs, unit: "g", color: "#FFC107", icon: "bread-slice" },
          { label: "Fats", value: 0, goal: macros.fats, unit: "g", color: "#03A9F4", icon: "peanut" },
          { label: "Fiber", value: 0, goal: macros.fiber, unit: "g", color: "#9C27B0", icon: "leaf" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching meal budget:", err);
    }
  };

  const fetchSelectedFoods = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/meal-log/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && category) {
        const meal = category.toString().toLowerCase();
        const filtered = data.meals.filter((mealItem: any) => mealItem.mealType === meal);
        setSelectedFoods(
          filtered.map((item: any) => ({
            id: item.id.toString(),
            name: item.foodName,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading selected foods:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMealGoals();
      fetchSelectedFoods();
    }, [category])
  );

  useEffect(() => {
    const totals = selectedFoods.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fats += item.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  
    setNutritionData(prev =>
      prev.map(n => ({
        ...n,
        value: Math.round(
          n.label === "Calories"
            ? totals.calories
            : n.label === "Protein"
            ? totals.protein
            : n.label === "Carbs"
            ? totals.carbs
            : n.label === "Fats"
            ? totals.fats
            : 0
        ),
      }))
    );
  }, [selectedFoods]);
  

  const handleRemoveFood = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/meal-log/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSelectedFoods((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.warn("Failed to delete food");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFoodSelect = (food: SelectedFoodItem) => {
    setSearchVisible(false);
    router.push({
      pathname: "/mealTracking/quantity",
      params: {
        foodId: food.id,
        foodName: food.name,
        category: category?.toString() || "",
      },
    });
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim().length === 0) return setSearchResults([]);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/meal-log/search-food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();

      if (res.ok) {
        const formatted: SelectedFoodItem[] = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        }));

        setSearchResults(formatted);
      } else {
        console.warn("Search failed:", data);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const formatCategory = (text: string | string[] | undefined) => {
    if (!text || typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const getIcon = (categoryName: string | string[] | undefined) =>
    (categoryName === "breakfast" && "cafe-outline") ||
    (categoryName === "lunch" && "restaurant-outline") ||
    (categoryName === "dinner" && "moon-outline") ||
    "fast-food-outline";

  return (
    <LinearGradient colors={["#F8FAFB", "#E3F2FD"]} style={{ flex: 1 }}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.topTitle}>{formatCategory(category)}</Text>
          <Ionicons name={getIcon(category)} size={20} color="#333" style={{ marginLeft: 6 }} />
        </View>
        <View style={{ width: 32 }} />
      </View>

      <TouchableOpacity style={styles.searchBarContainer} onPress={() => setSearchVisible(true)}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Search food items...</Text>
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={() => (
          <>
            <NutrientProgress data={nutritionData} />
            <SelectedFoods foods={selectedFoods} onRemove={handleRemoveFood} />
          </>
        )}
        data={[]}
        renderItem={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchMealGoals();
              await fetchSelectedFoods();
              setRefreshing(false);
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal visible={searchVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TextInput
              autoFocus
              placeholder="Search food..."
              value={searchText}
              onChangeText={handleSearch}
              style={styles.modalInput}
              placeholderTextColor="#777"
            />
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleFoodSelect(item)}
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>
                  {item.calories} kcal | {item.protein}g P | {item.carbs}g C | {item.fats}g F
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() =>
              searchText.trim() !== "" ? (
                <Text style={styles.noResults}>No results found</Text>
              ) : null
            }
          />
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default CategoryScreen;



const styles = StyleSheet.create({
 
    container: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },
    topSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Platform.OS === "android" ? 60 : 40, // 👈 Top safe spacing
        marginBottom: 10,
      },    backButton: { padding: 5 },
    titleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 },
    topTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  
    searchBarContainer: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      alignItems: "center",
      marginBottom: 10,
      elevation: 2,
    },
    searchIcon: { marginRight: 8 },
    searchPlaceholder: { color: "#777", fontSize: 16 },
  
    modalContainer: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
    modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    modalInput: {
      flex: 1,
      marginLeft: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      fontSize: 16,
      paddingVertical: 6,
      color: "#333",
    },
    modalResults: { paddingBottom: 20 },
    resultItem: {
      backgroundColor: "#f2f2f2",
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    name: { fontSize: 16, fontWeight: "600", color: "#333" },
    details: { fontSize: 13, color: "#777" },
    noResults: { textAlign: "center", color: "#777", marginTop: 20 },
  });
  