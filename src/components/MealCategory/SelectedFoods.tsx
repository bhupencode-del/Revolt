import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type SelectedFoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type Props = {
  foods: SelectedFoodItem[];
  onRemove: (id: string) => void;
  onPress?: (food: SelectedFoodItem) => void; // ✅ Optional press handler
};

const SelectedFoods = ({ foods, onRemove, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Foods</Text>

      {foods.length === 0 ? (
        <Text style={styles.emptyText}>No food items selected</Text>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPress?.(item)}
              activeOpacity={0.8}
              style={styles.item}
            >
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>
                  {item.calories} kcal | {item.protein}g P | {item.carbs}g C | {item.fats}g F
                </Text>
              </View>

              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#E53935" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

export default SelectedFoods;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
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
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
});