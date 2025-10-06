import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CaloriePresetSelector from "@/components/MealCategory/CaloriePresetSelector";
import { BASE_URL } from "@/config/config";


const validIcons = [
  "cafe-outline",
  "restaurant-outline",
  "moon-outline",
  "ice-cream-outline",
  "fitness-outline",
  "leaf-outline",
  "egg-outline",
];

const SetCalorieBudget = () => {
  const navigation = useNavigation();
  const [preset, setPreset] = useState("weight_loss");
  const [totalCalories, setTotalCalories] = useState(2000);
  const [breakfast, setBreakfast] = useState(400);
  const [lunch, setLunch] = useState(700);
  const [dinner, setDinner] = useState(600);
  const [snacks, setSnacks] = useState(300);
  const [protein, setProtein] = useState(100);
  const [carbs, setCarbs] = useState(250);
  const [fats, setFats] = useState(70);
  const [autoCalculate, setAutoCalculate] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/user/calorie-budget`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setTotalCalories(data.totalCalories);
          setBreakfast(data.meals?.breakfast ?? 0);
          setLunch(data.meals?.lunch ?? 0);
          setDinner(data.meals?.dinner ?? 0);
          setSnacks(data.meals?.snacks ?? 0);
          setProtein(data.macros?.protein ?? 0);
          setCarbs(data.macros?.carbs ?? 0);
          setFats(data.macros?.fats ?? 0);
        }
      } catch (err) {
        console.error("Error fetching existing budget:", err);
      }
    };

    fetchBudget();
  }, []);

  useEffect(() => {
    if (autoCalculate && totalCalories) {
      const proteinRatio = 0.3;
      const carbsRatio = 0.5;
      const fatsRatio = 0.2;

      setProtein(Math.round((totalCalories * proteinRatio) / 4));
      setCarbs(Math.round((totalCalories * carbsRatio) / 4));
      setFats(Math.round((totalCalories * fatsRatio) / 9));
    }
  }, [totalCalories, autoCalculate]);

  const handleSave = async () => {
    const totalMeals = breakfast + lunch + dinner + snacks;
    if (totalMeals !== totalCalories) {
      Alert.alert("⚠️ Calorie Mismatch", "Sum of meals doesn't match total calories.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    const payload = {
      totalCalories,
      meals: { breakfast, lunch, dinner, snacks },
      macros: { protein, carbs, fats },
    };

    try {
      const response = await fetch(`${BASE_URL}/user/calorie-budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("✅ Success", "Calorie budget saved successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Set Calorie Budget</Text>
        </View>

        <View style={styles.cardGreen}>
          <Ionicons name="sparkles-outline" size={22} color="#4CAF50" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.recommendTitle}>Recommended</Text>
            <Text style={styles.recommendText}>1800 - 2200 kcal/day (Weight Loss)</Text>
          </View>
        </View>

        <CaloriePresetSelector value={preset} onChange={setPreset} />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Total Daily Calorie Budget</Text>
          <TextInput
            style={styles.inputLarge}
            keyboardType="numeric"
            value={totalCalories.toString()}
            onChangeText={(val) => setTotalCalories(parseInt(val) || 0)}
          />
          <TouchableOpacity style={styles.inlineSave} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#4CAF50" />
            <Text style={styles.inlineSaveText}>Save Budget</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calories per Meal</Text>
          {[
            { label: "Breakfast", value: breakfast, setter: setBreakfast, icon: "cafe-outline" },
            { label: "Lunch", value: lunch, setter: setLunch, icon: "restaurant-outline" },
            { label: "Dinner", value: dinner, setter: setDinner, icon: "moon-outline" },
            { label: "Snacks", value: snacks, setter: setSnacks, icon: "ice-cream-outline" },
          ].map((meal, idx) => (
            <View key={idx}>
              <View style={styles.inputIconRow}>
                <Ionicons
                  name={validIcons.includes(meal.icon) ? (meal.icon as any) : "help-outline"}
                  size={18}
                  color="#777"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.inputLabel}>{meal.label}</Text>
              </View>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={meal.value.toString()}
                onChangeText={(val) => meal.setter(parseInt(val) || 0)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.inlineSave} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#4CAF50" />
            <Text style={styles.inlineSaveText}>Save Meal Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.macroHeaderRow}>
            <Text style={styles.sectionTitle}>Macronutrients (grams)</Text>
            <View style={styles.switchRow}>
              <Text style={{ fontSize: 13, marginRight: 6 }}>Auto Calculate</Text>
              <Switch value={autoCalculate} onValueChange={setAutoCalculate} />
            </View>
          </View>

          {[
            { label: "Protein", value: protein, setter: setProtein, icon: "fitness-outline" },
            { label: "Carbs", value: carbs, setter: setCarbs, icon: "leaf-outline" },
            { label: "Fats", value: fats, setter: setFats, icon: "egg-outline" },
          ].map((macro, idx) => (
            <View key={idx}>
              <View style={styles.inputIconRow}>
                <Ionicons
                  name={validIcons.includes(macro.icon) ? (macro.icon as any) : "help-outline"}
                  size={18}
                  color="#777"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.inputLabel}>{macro.label}</Text>
              </View>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                editable={!autoCalculate}
                value={macro.value.toString()}
                onChangeText={(val) => macro.setter(parseInt(val) || 0)}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveText}>Save All</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SetCalorieBudget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 60 : 40, // ✅ This controls spacing from top
    marginBottom: 16,
  }, 
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGreen: {
    backgroundColor: "#E8F5E9",
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  recommendText: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#333",
  },
  inputIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  macroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    color: "#000",
    marginBottom: 8,
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  inlineSave: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  inlineSaveText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
