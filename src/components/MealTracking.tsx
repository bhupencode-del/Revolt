import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';

// Define Navigation Types
type RootStackParamList = {
  MealTracking: undefined;
  MealDetails: { mealName: string };
};

type Props = StackScreenProps<RootStackParamList, 'MealTracking'>;

const MealTrackingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Tracking</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Daily Summary Bar */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="flame-outline" size={20} color="#FF5722" />
              <Text style={styles.summaryValue}>1234 kcal</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="barbell-outline" size={20} color="#4CAF50" />
              <Text style={styles.summaryValue}>100g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="nutrition-outline" size={20} color="#FFC107" />
              <Text style={styles.summaryValue}>150g</Text>
              <Text style={styles.summaryLabel}>Carbs</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="water-outline" size={20} color="#03A9F4" />
              <Text style={styles.summaryValue}>50g</Text>
              <Text style={styles.summaryLabel}>Fats</Text>
            </View>
          </View>
        </View>

        {/* Meal Sections */}
        <View style={styles.mealSection}>
          <Text style={styles.sectionTitle}>Meals</Text>
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.mealCard} 
              onPress={() => navigation.navigate('MealDetails', { mealName: meal })}
            >
              <Text style={styles.mealName}>{meal}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#333" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Meal Button */}
        <TouchableOpacity style={styles.addMealButton}>
          <Text style={styles.addMealButtonText}>+ Add Meal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MealTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  mealSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mealCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addMealButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addMealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
