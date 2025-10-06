import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// ✅ Define props type explicitly
interface MealSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const TrackMealSum: React.FC<MealSummaryProps> = ({ calories, protein, carbs, fats }) => {
  const router = useRouter();

  return (
    <LinearGradient colors={['#F5F7FA', '#DDE5ED']} style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.title}>Today's Meal Summary</Text>
      </View>

      {/* 🔥 Nutrient Grid */}
      <View style={styles.nutrientRow}>
        {[
          { icon: 'flame-outline', color: '#FF5722', label: 'Calories', value: `${calories} kcal` },
          { icon: 'fish-outline', color: '#4CAF50', label: 'Protein', value: `${protein}g` },
          { icon: 'pizza-outline', color: '#FFC107', label: 'Carbs', value: `${carbs}g` },
          { icon: 'egg-outline', color: '#03A9F4', label: 'Fats', value: `${fats}g` },
        ].map((item, index) => (
          <View key={index} style={styles.nutrientBox}>
            <LinearGradient colors={['#fff', '#E3E6EB']} style={styles.iconCircle}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </LinearGradient>
            <Text style={styles.nutrientValue}>{item.value}</Text>
            <Text style={styles.nutrientLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* ✅ **Premium Track Meal Button** */}
      <TouchableOpacity
        style={styles.trackMealButton}
        activeOpacity={0.85}
        onPress={() => router.push('/mealTracking')}
      >
        <LinearGradient colors={['#2ECC71', '#27AE60']} style={styles.trackMealButtonInner}>
          <Text style={styles.trackMealButtonText}>Track Your Meal</Text>
          <Ionicons name="fast-food-outline" size={22} color="#fff" style={styles.trackMealIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 26,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutrientBox: {
    alignItems: 'center',
    width: 70,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  trackMealButton: {
    marginTop: 10,
    borderRadius: 50,
    overflow: 'hidden',
  },
  trackMealButtonInner: {
    paddingVertical: 14,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#27AE60',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  trackMealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  trackMealIcon: {
    transform: [{ scale: 1.2 }],
  },
});

export default TrackMealSum;
