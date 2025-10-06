import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "@/config/config";


const mealCategories = {
  Breakfast: { icon: "cafe-outline", color: "#FFA726" },
  Lunch: { icon: "restaurant-outline", color: "#4CAF50" },
  Dinner: { icon: "moon-outline", color: "#FF7043" },
  Snacks: { icon: "fast-food-outline", color: "#8E24AA" },
} as const;

type MacroType = "calories" | "protein" | "carbs" | "fats";

type MealLogProps = {
  selectedDate?: string;
  onLogChange?: () => void; // ✅ new prop
};

const MealLog: React.FC<MealLogProps> = ({
  selectedDate = new Date().toISOString().slice(0, 10),
  onLogChange,
}) => {
  const router = useRouter();
  const [journalText, setJournalText] = useState("");
  const [macronutrientGoals, setMacronutrientGoals] = useState<Record<MacroType, number>>({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fats: 70,
  });
  const [totalMacros, setTotalMacros] = useState<Record<MacroType, number>>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;

          const [budgetRes, todayRes] = await Promise.all([
            fetch(`${BASE_URL}/user/calorie-budget`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${BASE_URL}/meal-log/today`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const budgetData = await budgetRes.json();
          const todayData = await todayRes.json();

          if (budgetRes.ok) {
            setMacronutrientGoals({
              calories: budgetData.totalCalories,
              protein: budgetData.macros.protein,
              carbs: budgetData.macros.carbs,
              fats: budgetData.macros.fats,
            });
          }
          if (todayRes.ok) {
            setTotalMacros({
              calories: todayData.totalCalories,
              protein: todayData.totalProtein,
              carbs: todayData.totalCarbs,
              fats: todayData.totalFats,
            });

            // ✅ Trigger meal progress update
            if (onLogChange) onLogChange();
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <LinearGradient colors={["#F8FAFB", "#E3F2FD"]} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 20 : 30}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🔥 Nutrition */}
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Today's Nutrition</Text>

          {(Object.keys(macronutrientGoals) as MacroType[]).map((macro) => (
  <View key={macro} style={styles.macroContainer}>
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>
        {macro.charAt(0).toUpperCase() + macro.slice(1)}
      </Text>
      <Text style={styles.macroValue}>
        {Math.round(totalMacros[macro])} / {Math.round(macronutrientGoals[macro])}{" "}
        {macro === "calories" ? "kcal" : "g"}
      </Text>
    </View>
    <Progress.Bar
      progress={totalMacros[macro] / macronutrientGoals[macro]}
      width={null}
      height={10}
      color={
        macro === "calories"
          ? "#FF5722"
          : macro === "protein"
          ? "#4CAF50"
          : macro === "carbs"
          ? "#FFC107"
          : "#03A9F4"
      }
      unfilledColor="#EEE"
      borderRadius={10}
      style={styles.progressBar}
    />
  </View>
))}


          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => router.push("/NutritionDetails")}
          >
            <Text style={styles.viewDetailsText}>View in Details</Text>
          </TouchableOpacity>
        </View>

        {/* 🥗 Meal Logging */}
        <Text style={styles.logMealHeading}>Log Your Meal</Text>

        {Object.keys(mealCategories).map((category) => {
          const { icon, color } = mealCategories[category as keyof typeof mealCategories];
          return (
            <View key={category} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealTitle}>
                  <Ionicons name={icon as any} size={24} color={color} style={styles.iconSpacing} />
                  <Text style={[styles.categoryTitle, { color }]}>{category}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push(`/mealTracking/${category.toLowerCase()}`)}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* 📘 Daily Journal */}
        <View style={styles.journalContainer}>
          <Text style={styles.journalTitle}>📝 Daily Journal</Text>
          <TextInput
            value={journalText}
            onChangeText={setJournalText}
            placeholder="Write your thoughts, mood, or anything..."
            multiline
            style={styles.journalInput}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 50 }} />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default MealLog;


const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  nutritionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    elevation: 2,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  macroContainer: { marginBottom: 12 },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  macroLabel: { fontSize: 14, fontWeight: "600", color: "#555" },
  macroValue: { fontSize: 14, fontWeight: "bold", color: "#222" },
  progressBar: { marginBottom: 8 },
  viewDetailsButton: {
    marginTop: 12,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  logMealHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTitle: { flexDirection: "row", alignItems: "center" },
  iconSpacing: { marginRight: 10 },
  categoryTitle: { fontSize: 16, fontWeight: "bold" },
  journalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    elevation: 2,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  journalInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
});