// src/app/mealTracking/quantity.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "@/config/config";

const QuantityScreen = () => {
  const router = useRouter();
  const { foodId, foodName, category } = useLocalSearchParams();

  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("g");
  const [unitItems, setUnitItems] = useState<{ label: string; value: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNutrition = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !foodId) return;

      const res = await fetch(
        `${BASE_URL}/meal-log/nutrition?foodId=${foodId}&quantity=${quantity}&unit=${unit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setImage(data.image);
        setAvailableUnits(data.availableUnits);

        if (data.availableUnits.length > 0 && !data.availableUnits.includes(unit)) {
          setUnit(data.availableUnits[0]);
        }

        setUnitItems(data.availableUnits.map((u: string) => ({ label: u, value: u })));

        const nutrients = data.nutrition.reduce((acc: any, item: any) => {
          if (item.name === "Calories") acc.calories = item.amount;
          if (item.name === "Protein") acc.protein = item.amount;
          if (item.name === "Carbohydrates") acc.carbs = item.amount;
          if (item.name === "Fat") acc.fats = item.amount;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        setNutrition(nutrients);
      }
    } catch (err) {
      console.error("Error fetching nutrition:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, [foodId]);

  useEffect(() => {
    if (availableUnits.length) {
      fetchNutrition();
    }
  }, [quantity, unit]);

  const handleAddFood = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/meal-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodName,
          quantity: Number(quantity),
          unit,
          calories: Number(nutrition.calories.toFixed(1)),
          protein: Number(nutrition.protein.toFixed(1)),
          carbs: Number(nutrition.carbs.toFixed(1)),
          fats: Number(nutrition.fats.toFixed(1)),
          mealType: category?.toString().toLowerCase(),
        }),
      });

      if (res.ok) {
        router.back();
      } else {
        const errorData = await res.json();
        console.warn("Failed to add food:", errorData);
      }
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* ✅ Header Row for Top Spacing */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
        ) : (
          <>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <Text style={styles.foodName}>{foodName}</Text>

            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter quantity"
              returnKeyType="done"
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Measurement Unit</Text>
            <DropDownPicker
              open={open}
              value={unit}
              items={unitItems}
              setOpen={setOpen}
              setValue={setUnit}
              setItems={setUnitItems}
              placeholder="Select Unit"
              style={styles.dropdownPicker}
              dropDownContainerStyle={styles.dropdownContainerStyle}
            />

            <View style={styles.nutritionBox}>
              <Text style={styles.nutritionTitle}>Nutrition for {quantity}{unit}</Text>
              <Text style={styles.nutritionItem}>Calories: {nutrition.calories.toFixed(1)} kcal</Text>
              <Text style={styles.nutritionItem}>Protein: {nutrition.protein.toFixed(1)} g</Text>
              <Text style={styles.nutritionItem}>Carbs: {nutrition.carbs.toFixed(1)} g</Text>
              <Text style={styles.nutritionItem}>Fats: {nutrition.fats.toFixed(1)} g</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default QuantityScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8FAFB" },
  
    // 🟢 Add this headerRow to push content down (like spacing fix)
    headerRow: {
      marginTop: Platform.OS === "android" ? 40 : 20,
      marginBottom: 10,
    },
  
    backButton: { marginBottom: 10 },
    image: {
      width: "100%",
      height: 180,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: "#eee",
    },
    imagePlaceholder: {
      width: "100%",
      height: 180,
      borderRadius: 12,
      backgroundColor: "#ddd",
      marginBottom: 12,
    },
    foodName: {
      fontSize: 20,
      fontWeight: "700",
      color: "#333",
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: "#555",
      marginBottom: 6,
    },
    input: {
      backgroundColor: "#fff",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    dropdownPicker: {
      marginTop: 5,
      backgroundColor: "#fff",
      borderColor: "#ccc",
    },
    dropdownContainerStyle: {
      backgroundColor: "#fff",
      borderColor: "#ccc",
    },
    nutritionBox: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 16,
      marginTop: 24,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    nutritionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      color: "#333",
    },
    nutritionItem: {
      fontSize: 14,
      marginBottom: 4,
      color: "#555",
    },
    addButton: {
      backgroundColor: "#4CAF50",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      marginLeft: 8,
      fontWeight: "600",
    },
  });
  