import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from "react-native";

// Mock food database (replace later with API)
const mockFoodDatabase = [
  { id: '101', name: 'Boiled Egg', calories: 78 },
  { id: '102', name: 'Scrambled Egg', calories: 91 },
  { id: '103', name: 'Oats', calories: 150 },
  { id: '104', name: 'Chicken Breast', calories: 165 },
  { id: '105', name: 'Apple', calories: 95 },
];

type Props = {
  visible: boolean;
  mealName: string;
  onClose: () => void;
};

const MealDetail = ({ visible, mealName, onClose }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [addedFoods, setAddedFoods] = useState<typeof mockFoodDatabase>([]);

  const filteredFoods = mockFoodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddFood = (food: (typeof mockFoodDatabase)[0]) => {
    setAddedFoods((prev) => [...prev, { ...food, id: Date.now().toString() }]);
    setSearchText('');
  };

  const handleDeleteFood = (foodId: string) => {
    setAddedFoods((prev) => prev.filter((food) => food.id !== foodId));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{mealName}</Text>

          {/* Search bar */}
          <TextInput
            placeholder="Search for food"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />

          {/* Search results */}
          {searchText.length > 0 && (
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAddFood(item)} style={styles.foodItem}>
                  <Text style={styles.foodText}>{item.name}</Text>
                  <Text style={styles.calorieText}>{item.calories} kcal</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No food found</Text>}
              style={{ maxHeight: 150 }}
            />
          )}

          {/* Added foods */}
          <Text style={styles.subtitle}>Foods Added:</Text>
          {addedFoods.length === 0 ? (
            <Text style={styles.emptyText}>No foods added yet</Text>
          ) : (
            <FlatList
              data={addedFoods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.addedFoodItem}>
                  <Text style={styles.foodText}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.calorieText}>{item.calories} kcal</Text>
                    <TouchableOpacity onPress={() => handleDeleteFood(item.id)}>
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              style={{ marginBottom: 20 }}
            />
          )}

          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 20, 
    width: "90%", 
    height: "70%", // ✅ Large modal taking 90% height
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15 },
  foodItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", justifyContent: "space-between" },
  foodText: { fontSize: 16, color: "#333" },
  calorieText: { fontSize: 14, color: "#666", marginLeft: 10 },
  emptyText: { textAlign: "center", color: "#999", marginVertical: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  addedFoodItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  deleteText: { color: "red", fontWeight: "bold", marginLeft: 10 },
  closeButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center" },
  closeButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default MealDetail;
