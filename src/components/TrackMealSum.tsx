import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'; // ✅ Import router for navigation

const TrackMealSummaryBadges = () => {
  const router = useRouter(); // ✅ Use Expo Router navigation

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.title}>Today's Meal Summary</Text>
      </View>

      <View style={styles.nutrientRow}>
        <View style={styles.nutrientBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="flame-outline" size={20} color="#FF5722" />
          </View>
          <Text style={styles.nutrientValue}>1234 kcal</Text>
          <Text style={styles.nutrientLabel}>Calories</Text>
        </View>
        <View style={styles.nutrientBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="fish-outline" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.nutrientValue}>100g</Text>
          <Text style={styles.nutrientLabel}>Protein</Text>
        </View>
        <View style={styles.nutrientBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="pizza-outline" size={20} color="#FFC107" />
          </View>
          <Text style={styles.nutrientValue}>150g</Text>
          <Text style={styles.nutrientLabel}>Carbs</Text>
        </View>
        <View style={styles.nutrientBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="egg-outline" size={20} color="#03A9F4" />
          </View>
          <Text style={styles.nutrientValue}>50g</Text>
          <Text style={styles.nutrientLabel}>Fats</Text>
        </View>
      </View>

      {/* ✅ Fixed Track Meal Button with Expo Router */}
      <TouchableOpacity style={styles.trackButton} onPress={() => router.push('/mealTracking')}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.trackButtonText}>Track Your Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    backgroundColor: '',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#888',
  },
  trackButton: {
    marginTop: 10,
    backgroundColor: '#6FCF97',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TrackMealSummaryBadges;
