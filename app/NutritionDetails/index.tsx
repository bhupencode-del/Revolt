import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Animated } from "react-native";



// Type Definitions
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

type Microe = {
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

type MealType ="Today"| "Breakfast" | "Lunch" | "Dinner" | "Snacks";

// Sample Nutritional Data by Meal Type
const nutrientData: Record<MealType, MealData> = {
  Today: {
    macros: [
      { label: "Protein", value: 25, target: 100, color: "#FF7043" },
      { label: "Carbs", value: 70, target: 200, color: "#66BB6A" },
      { label: "Fats", value: 20, target: 70, color: "#29B6F6" },
      { label: "Fiber", value: 10, target: 30, color: "#AB47BC" },
    ],
    micros: [
      { label: "Calcium", value: 300, target: 1000, unit: "mg" },
      { label: "Iron", value: 6, target: 18, unit: "mg" },
      { label: "Magnesium", value: 150, target: 400, unit: "mg" },
      { label: "Zinc", value: 5, target: 11, unit: "mg" },
      { label: "Pottasium", value: 30, target: 90, unit: "mg" },
    ],
    microes: [
      { label: "Vitamin A", value: 600, target: 900, unit: "mcg" },
      { label: "Vitamin C", value: 60, target: 90, unit: "mg" },
      { label: "Vitamin D", value: 10, target: 20, unit: "mcg" },
      { label: "Vitamin B12", value: 1.8, target: 2.4, unit: "mcg" },
      { label: "Folate", value: 300, target: 400, unit: "mcg" },
    ],
    calories: 1800,
  },
  Breakfast: {
    macros: [
      { label: "Protein", value: 25, target: 100, color: "#FF7043" },
      { label: "Carbs", value: 70, target: 200, color: "#66BB6A" },
      { label: "Fats", value: 20, target: 70, color: "#29B6F6" },
      { label: "Fiber", value: 10, target: 30, color: "#AB47BC" },
    ],
    micros: [
      { label: "Calcium", value: 300, target: 1000, unit: "mg" },
      { label: "Iron", value: 6, target: 18, unit: "mg" },
      { label: "Magnesium", value: 150, target: 400, unit: "mg" },
      { label: "Zinc", value: 5, target: 11, unit: "mg" },
      { label: "Pottasium", value: 30, target: 90, unit: "mg" },
    ],
    microes: [
      { label: "Vitamin A", value: 600, target: 900, unit: "mcg" },
      { label: "Vitamin C", value: 60, target: 90, unit: "mg" },
      { label: "Vitamin D", value: 10, target: 20, unit: "mcg" },
      { label: "Vitamin B12", value: 1.8, target: 2.4, unit: "mcg" },
      { label: "Folate", value: 300, target: 400, unit: "mcg" },
    ],
    calories: 400,
  },
  Lunch: {
    macros: [
      { label: "Protein", value: 40, target: 100, color: "#FF7043" },
      { label: "Carbs", value: 100, target: 200, color: "#66BB6A" },
      { label: "Fats", value: 25, target: 70, color: "#29B6F6" },
      { label: "Fiber", value: 5, target: 30, color: "#AB47BC" },
    ],
    micros: [
      { label: "Calcium", value: 200, target: 1000, unit: "mg" },
      { label: "Iron", value: 3, target: 18, unit: "mg" },
      { label: "Magnesium", value: 100, target: 400, unit: "mg" },
      { label: "Zinc", value: 2, target: 11, unit: "mg" },
      { label: "Pottasium", value: 20, target: 90, unit: "mg" },
    ],
    microes: [
      { label: "Vitamin A", value: 600, target: 900, unit: "mcg" },
      { label: "Vitamin C", value: 60, target: 90, unit: "mg" },
      { label: "Vitamin D", value: 10, target: 20, unit: "mcg" },
      { label: "Vitamin B12", value: 1.8, target: 2.4, unit: "mcg" },
      { label: "Folate", value: 300, target: 400, unit: "mcg" },
    ],
    calories: 600,
  },
  Dinner: {
    macros: [
      { label: "Protein", value: 30, target: 100, color: "#FF7043" },
      { label: "Carbs", value: 80, target: 200, color: "#66BB6A" },
      { label: "Fats", value: 15, target: 70, color: "#29B6F6" },
      { label: "Fiber", value: 10, target: 30, color: "#AB47BC" },
    ],
    micros: [
      { label: "Calcium", value: 250, target: 1000, unit: "mg" },
      { label: "Iron", value: 4, target: 18, unit: "mg" },
      { label: "Magnesium", value: 120, target: 400, unit: "mg" },
      { label: "Zinc", value: 3, target: 11, unit: "mg" },
      { label: "Pottasium", value: 25, target: 90, unit: "mg" },
    ],
    microes: [
      { label: "Vitamin A", value: 600, target: 900, unit: "mcg" },
      { label: "Vitamin C", value: 60, target: 90, unit: "mg" },
      { label: "Vitamin D", value: 10, target: 20, unit: "mcg" },
      { label: "Vitamin B12", value: 1.8, target: 2.4, unit: "mcg" },
      { label: "Folate", value: 300, target: 400, unit: "mcg" },
    ],
    calories: 550,
  },
  Snacks: {
    macros: [
      { label: "Protein", value: 10, target: 100, color: "#FF7043" },
      { label: "Carbs", value: 30, target: 200, color: "#66BB6A" },
      { label: "Fats", value: 5, target: 70, color: "#29B6F6" },
      { label: "Fiber", value: 2, target: 30, color: "#AB47BC" },
    ],
    micros: [
      { label: "Calcium", value: 100, target: 1000, unit: "mg" },
      { label: "Iron", value: 1, target: 18, unit: "mg" },
      { label: "Magnesium", value: 50, target: 400, unit: "mg" },
      { label: "Zinc", value: 1, target: 11, unit: "mg" },
      { label: "Pottasium", value: 10, target: 90, unit: "mg" },
    ],
    microes: [
      { label: "Vitamin A", value: 600, target: 900, unit: "mcg" },
      { label: "Vitamin C", value: 60, target: 90, unit: "mg" },
      { label: "Vitamin D", value: 10, target: 20, unit: "mcg" },
      { label: "Vitamin B12", value: 1.8, target: 2.4, unit: "mcg" },
      { label: "Folate", value: 300, target: 400, unit: "mcg" },
    ],
    calories: 200,
  },
};

const mealTypes: MealType[] = ["Today","Breakfast", "Lunch", "Dinner", "Snacks"];

const NutritionDetails = () => {
    const [selectedMeal, setSelectedMeal] = useState<MealType>("Today");
    const [showMacros, setShowMacros] = useState(true);
    const [showMicros, setShowMicros] = useState(false);
    const [showMicroes, setShowMicroes] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const navigation = useNavigation();
  
    const data = nutrientData[selectedMeal];
    const caloriePercentage = data.calories / 2000;
  
    const handleConfirmDate = (selectedDate: Date) => {
      setShowDatePicker(false);
      setDate(selectedDate);
    };
  
    return (
      <ScrollView style={styles.container}>
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
  
        <View style={styles.mealSelectorContainer}>
          {mealTypes.map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[styles.mealButton, selectedMeal === meal && styles.mealButtonSelected]}
              onPress={() => setSelectedMeal(meal)}
            >
              <Text
                style={selectedMeal === meal ? styles.mealButtonTextSelected : styles.mealButtonText}
              >
                {meal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>📈 Protein intake increased by 20% from yesterday</Text>
          <Text style={styles.insightText}>⚠️ Potassium intake is below target</Text>
        </View>
  
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
          <Text style={styles.calorieTargetLabel}>Target: 2000 kcal</Text>
        </Animated.View>
  
        <TouchableOpacity style={styles.card} onPress={() => setShowMacros(!showMacros)}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          {showMacros && data.macros.map((item, index) => (
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
                <Text style={styles.valueText}>{item.value}g / {item.target}g</Text>
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
  
        <TouchableOpacity style={styles.card} onPress={() => setShowMicros(!showMicros)}>
          <Text style={styles.sectionTitle}>Micronutrients</Text>
          {showMicros && data.micros.map((item, index) => (
            <Animated.View key={index} style={styles.nutrientCardRow}>
              <View style={styles.nutrientRowTextWrap}>
                <View style={styles.iconWithLabel}>
                  <Ionicons
                    name={
                      item.label === "Calcium"
                        ? "medkit"
                        : item.label === "Iron"
                        ? "hammer"
                        : item.label === "Magnesium"
                        ? "planet"
                        : item.label === "Zinc"
                        ? "construct"
                        : "water"
                    }
                    size={16}
                    color="#4FC3F7"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                <Text style={styles.valueText}>{item.value}{item.unit} / {item.target}{item.unit}</Text>
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
  
        <TouchableOpacity style={styles.card} onPress={() => setShowMicroes(!showMicroes)}>
          <Text style={styles.sectionTitle}>Vitamins</Text>
          {showMicroes && data.microes.map((item, index) => (
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
                <Text style={styles.valueText}>{item.value}{item.unit} / {item.target}{item.unit}</Text>
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
    );
  };
  
  export default NutritionDetails;
  
  
  
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8F5E9", padding: 20 },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      marginBottom: 20,
    },
    mealSelectorContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 15,
    },
    mealButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: "#F0F0F0",
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

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        marginBottom: 10,
      },
      
      headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        flex: 1,
      },

    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
    },
    calorieCardWrapper: {
      backgroundColor: "#fff",
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 20,
      elevation: 3,
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
      marginBottom: 8,
    },
    progressBarWrapper: {
      marginBottom: 10,
    },
    calorieTargetLabel: {
      fontSize: 14,
      color: "#333",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      color: "#555",
    },
    valueText: {
      fontSize: 12,
      color: "#777",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      },
    insightCard: {
      backgroundColor: "#FFF3E0",
      borderRadius: 12,
      padding: 15,
      marginTop: 10,
      marginBottom: 10,
    },
    insightText: {
      fontSize: 14,
      color: "#FF6F00",
      marginBottom: 5,
    },
    macroCard: {
      marginBottom: 16,
    },
    macroHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    nutrientCardRow: {
      marginBottom: 14,
    },
    nutrientRowTextWrap: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    iconWithLabel: {
      flexDirection: "row",
      alignItems: "center",
    },
    fullWidthBar: {
      flex: 1,
    },
  });
  