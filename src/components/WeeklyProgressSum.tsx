import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const WeeklyProgressSum = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Weekly Progress</Text>

      {/* Calories */}
      <View style={styles.row}>
        <Ionicons name="flame-outline" size={22} color="#FF5722" />
        <View style={styles.progressText}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>8400 / 10500 kcal</Text>
        </View>
      </View>

      {/* Exercise Days */}
      <View style={styles.row}>
        <Ionicons name="barbell-outline" size={22} color="#4CAF50" />
        <View style={styles.progressText}>
          <Text style={styles.label}>Exercise</Text>
          <Text style={styles.value}>3 / 5 Days</Text>
        </View>
      </View>

      {/* Water Intake */}
      <View style={styles.row}>
        <Ionicons name="water-outline" size={22} color="#03A9F4" />
        <View style={styles.progressText}>
          <Text style={styles.label}>Water</Text>
          <Text style={styles.value}>10 / 14 Glasses</Text>
        </View>
      </View>

      {/* Optional View More */}
      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>View Detailed Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeeklyProgressSum;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressText: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewMoreButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  viewMoreText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 14,
  },
});
