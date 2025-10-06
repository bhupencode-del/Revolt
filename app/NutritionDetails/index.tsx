import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";
import { SafeAreaView } from "react-native-safe-area-context";

type Macro = {
  label: string;
  value: number;
  target: number;
  color: string;
};

type Micro = {
  label: string;
  value: number;
  target: number;
  unit: string;
};

type MealData = {
  macros: Macro[];
  micros: Micro[];
  microes: Micro[];
  calories: number;
};

type MealType = "Today" | "Breakfast" | "Lunch" | "Dinner" | "Snacks";

const mealTypes: MealType[] = ["Today", "Breakfast", "Lunch", "Dinner", "Snacks"];

const NutritionDetails = () => {
  const [selectedMeal, setSelectedMeal] = useState<MealType>("Today");
  const [showMacros, setShowMacros] = useState(true);
  const [showMicros, setShowMicros] = useState(false);
  const [showMicroes, setShowMicroes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<MealData>({
    macros: [],
    micros: [],
    microes: [],
    calories: 0,
  });

  const [macroGoals, setMacroGoals] = useState({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fats: 70,
    perMeal: {
      breakfast: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      snacks: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    },
  });

  const navigation = useNavigation();

  const fetchCalorieBudget = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/user/calorie-budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setMacroGoals({
          calories: data.totalCalories || 2000,
          protein: data.macros?.protein || 100,
          carbs: data.macros?.carbs || 250,
          fats: data.macros?.fats || 70,
          perMeal: data.perMeal || {
            breakfast: { calories: 0, protein: 0, carbs: 0, fats: 0 },
            lunch: { calories: 0, protein: 0, carbs: 0, fats: 0 },
            dinner: { calories: 0, protein: 0, carbs: 0, fats: 0 },
            snacks: { calories: 0, protein: 0, carbs: 0, fats: 0 },
          },
        });
      }
    } catch (err) {
      console.error("Calorie budget fetch error:", err);
    }
  };

  const getCurrentMealGoals = () => {
    if (selectedMeal === "Today") {
      return {
        calories: macroGoals.calories,
        protein: macroGoals.protein,
        carbs: macroGoals.carbs,
        fats: macroGoals.fats,
      };
    }
  
    type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";
    const mealKey = selectedMeal.toLowerCase() as MealKey;
  
    return macroGoals.perMeal[mealKey] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };
  };
  

  const fetchNutritionData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const formattedDate = date.toISOString().split("T")[0];
      const mealType = selectedMeal === "Today" ? "" : selectedMeal.toLowerCase();

      const url = mealType
        ? `${BASE_URL}/meal-log/nutrition-summary?date=${formattedDate}&mealType=${mealType}`
        : `${BASE_URL}/meal-log/nutrition-summary?date=${formattedDate}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = await res.json();

      if (res.ok) {
        const round = (val: number) => Math.round(val);

        setData({
          calories: round(responseData.calories || 0),
          macros: (responseData.macros || []).map((m: any) => ({
            ...m,
            value: round(m.value),
            target: round(getMacroTarget(m.label)),
          })),
          micros: responseData.micros || [],
          microes: responseData.vitamins || [],
        });
      } else {
        console.warn("Nutrition fetch failed:", responseData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCalorieBudget();
  }, []);

  useEffect(() => {
    fetchNutritionData();
  }, [selectedMeal, date]);

  const currentGoals = getCurrentMealGoals();

  const getMacroTarget = (label: string) => {
    switch (label.toLowerCase()) {
      case "protein":
        return currentGoals.protein;
      case "carbs":
        return currentGoals.carbs;
      case "fats":
        return currentGoals.fats;
      default:
        return 0;
    }
  };

  const caloriePercentage = currentGoals.calories
    ? data.calories / currentGoals.calories
    : 0;

  const handleConfirmDate = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Nutrition Summary</Text>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
          display="inline"
        />

        {/* Meal Type Tabs */}
        <View style={styles.mealSelectorContainer}>
          {mealTypes.map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[
                styles.mealButton,
                selectedMeal === meal && styles.mealButtonSelected,
              ]}
              onPress={() => setSelectedMeal(meal)}
            >
              <Text
                style={
                  selectedMeal === meal
                    ? styles.mealButtonTextSelected
                    : styles.mealButtonText
                }
              >
                {meal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            📈 Protein intake increased by 20% from yesterday
          </Text>
          <Text style={styles.insightText}>
            ⚠️ Potassium intake is below target
          </Text>
        </View>

        {/* Calories */}
        <Animated.View style={styles.calorieCardWrapper}>
          <Text style={styles.calorieSectionHeading}>Calories</Text>
          <Text style={styles.calorieConsumed}>{data.calories} kcal</Text>
          <View style={styles.progressBarWrapper}>
            <Progress.Bar
              progress={caloriePercentage}
              width={250}
              height={12}
              color="#4A90E2"
              unfilledColor="#E0E0E0"
              borderWidth={0}
              borderRadius={6}
              animated
            />
          </View>
          <Text style={styles.calorieTargetLabel}>
            Target: {macroGoals.calories} kcal
          </Text>
        </Animated.View>

        {/* Macronutrients */}
        <TouchableOpacity style={styles.card} onPress={() => setShowMacros(!showMacros)}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          {showMacros &&
            data.macros.map((item, index) => (
              <Animated.View key={index} style={styles.nutrientCardRow}>
                <View style={styles.nutrientRowTextWrap}>
                  <View style={styles.iconWithLabel}>
                    <Ionicons
                      name={
                        item.label === "Protein"
                          ? "barbell"
                          : item.label === "Carbs"
                          ? "restaurant"
                          : item.label === "Fats"
                          ? "flame"
                          : "nutrition"
                      }
                      size={16}
                      color={item.color}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {item.value}g / {item.target}g
                  </Text>
                </View>
                <Progress.Bar
                  progress={item.value / item.target}
                  width={null}
                  height={10}
                  color={item.color}
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  borderRadius={6}
                  style={styles.fullWidthBar}
                  animated
                />
              </Animated.View>
            ))}
        </TouchableOpacity>

        {/* Micronutrients */}
        <TouchableOpacity style={styles.card} onPress={() => setShowMicros(!showMicros)}>
          <Text style={styles.sectionTitle}>Micronutrients</Text>
          {showMicros &&
            data.micros.map((item, index) => (
              <Animated.View key={index} style={styles.nutrientCardRow}>
                <View style={styles.nutrientRowTextWrap}>
                  <View style={styles.iconWithLabel}>
                    <Ionicons
                      name="water"
                      size={16}
                      color="#4FC3F7"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {item.value}
                    {item.unit} / {item.target}
                    {item.unit}
                  </Text>
                </View>
                <Progress.Bar
                  progress={item.value / item.target}
                  width={null}
                  height={10}
                  color="#4FC3F7"
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  borderRadius={6}
                  style={styles.fullWidthBar}
                  animated
                />
              </Animated.View>
            ))}
        </TouchableOpacity>

        {/* Vitamins */}
        <TouchableOpacity style={styles.card} onPress={() => setShowMicroes(!showMicroes)}>
          <Text style={styles.sectionTitle}>Vitamins</Text>
          {showMicroes &&
            data.microes.map((item, index) => (
              <Animated.View key={index} style={styles.nutrientCardRow}>
                <View style={styles.nutrientRowTextWrap}>
                  <View style={styles.iconWithLabel}>
                    <Ionicons
                      name={item.label.includes("Vitamin") ? "leaf" : "flower"}
                      size={16}
                      color="#FFD54F"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {item.value}
                    {item.unit} / {item.target}
                    {item.unit}
                  </Text>
                </View>
                <Progress.Bar
                  progress={item.value / item.target}
                  width={null}
                  height={10}
                  color="#FFD54F"
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  borderRadius={6}
                  style={styles.fullWidthBar}
                  animated
                />
              </Animated.View>
            ))}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutritionDetails;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F7FA", // matching your app's main background
      paddingHorizontal: 20,
    },
  
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      marginBottom: 10,
    },
  
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      flex: 1,
    },
  
    mealSelectorContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
      flexWrap: "wrap",
      gap: 8,
    },
  
    mealButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: "#E0E0E0",
      borderRadius: 20,
    },
  
    mealButtonSelected: {
      backgroundColor: "#4CAF50",
    },
  
    mealButtonText: {
      color: "#555",
      fontWeight: "600",
    },
  
    mealButtonTextSelected: {
      color: "#fff",
      fontWeight: "600",
    },
  
    insightCard: {
      backgroundColor: "#FFF8E1",
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
  
    insightText: {
      fontSize: 14,
      color: "#FF6F00",
      marginBottom: 6,
    },
  
    calorieCardWrapper: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      alignItems: "center",
    },
  
    calorieSectionHeading: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4A90E2",
      marginBottom: 6,
    },
  
    calorieConsumed: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#4A90E2",
      marginBottom: 10,
    },
  
    progressBarWrapper: {
      marginBottom: 10,
    },
  
    calorieTargetLabel: {
      fontSize: 14,
      color: "#444",
    },
  
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
  
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: 12,
    },
  
    nutrientCardRow: {
      marginBottom: 16,
    },
  
    nutrientRowTextWrap: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
  
    iconWithLabel: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    label: {
      fontSize: 14,
      color: "#444",
    },
  
    valueText: {
      fontSize: 13,
      color: "#666",
    },
  
    fullWidthBar: {
      flex: 1,
    },
  });
  
