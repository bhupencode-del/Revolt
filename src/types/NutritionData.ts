// 📄 src/types/NutritionData.ts
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type NutritionData = {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};
