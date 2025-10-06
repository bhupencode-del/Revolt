import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NutritionData } from "@/types/NutritionData";

type Props = {
  data: NutritionData[];
};

const NutritionProgress = ({ data }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Progress</Text>
      {data.map((item) => (
        <View key={item.label} style={styles.itemContainer}>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={item.color}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={styles.value}>
              {item.value}/{item.goal} {item.unit}
            </Text>
          </View>
          <Progress.Bar
            progress={Math.min(item.value / item.goal, 1)}
            width={null}
            height={10}
            color={item.color}
            unfilledColor="#E0E0E0"
            borderRadius={10}
            style={styles.progress}
          />
        </View>
      ))}
    </View>
  );
};

export default NutritionProgress;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 5,
    marginBottom: 16,
    marginTop:20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  itemContainer: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  progress: {
    marginTop: 4,
  },
});
