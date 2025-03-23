import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type MealEntry = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

interface LogMealModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meal: MealEntry) => void;
  category: string;
}

const LogMealModal: React.FC<LogMealModalProps> = ({
  visible,
  onClose,
  onSave,
  category,
}) => {
  const mockFood = {
    name: "Apple",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Search Food for {category}</Text>

          <TextInput
            placeholder="Search for food..."
            style={styles.input}
            placeholderTextColor="#888"
          />

          {/* Food result placeholder */}
          <ScrollView>
            <View style={styles.foodItemBox}>
              <Text style={styles.foodLabel}>🍎 Apple - 95 kcal / 100g</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => onSave({ ...mockFood, name: category })}
              >
                <Text style={styles.selectText}>Select</Text>
              </TouchableOpacity>
            </View>

            {/* You can add more mock results here for UI testing */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default LogMealModal;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "94%",
    height: height * 0.75, // ✅ Larger modal height
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 20,
    color: "#000",
  },
  foodItemBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  foodLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  selectButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  selectText: {
    color: "#fff",
    fontWeight: "600",
  },
});
