// src/components/MealCategory/SearchOverlay.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type SearchOverlayProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (food: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
};

const mockData = [
  { id: "1", name: "Boiled Egg", calories: 78, protein: 6, carbs: 0.6, fats: 5 },
  { id: "2", name: "Scrambled Egg", calories: 91, protein: 6.7, carbs: 1.2, fats: 6.7 },
  { id: "3", name: "Fried Egg", calories: 90, protein: 6.3, carbs: 0.4, fats: 7 },
];

const SearchOverlay = ({ visible, onClose, onSelect }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(mockData);

  useEffect(() => {
    if (searchQuery === "") {
      setResults([]);
      return;
    }

    // Simulate API search (replace this with actual API call)
    const filtered = mockData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
  }, [searchQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {/* 🔍 Top Bar */}
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search food..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        {/* 📋 Results */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                onSelect(item);
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text style={styles.resultDetails}>
                {item.calories} kcal | {item.protein}g P | {item.carbs}g C | {item.fats}g F
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>
              {searchQuery ? "No results found" : "Start typing to search..."}
            </Text>
          }
        />
      </View>
    </Modal>
  );
};

export default SearchOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    color: "#333",
  },
  resultItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resultDetails: {
    fontSize: 13,
    color: "#777",
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
    fontSize: 14,
  },
});