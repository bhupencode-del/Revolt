import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const DailyTrackers = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Daily Trackers</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.trackersRow}>
          {/* Activity */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="walk-outline" size={28} color="#4CAF50" />
            <Text style={styles.trackerLabel}>Activity</Text>
          </TouchableOpacity>

          {/* Water */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="water-outline" size={28} color="#03A9F4" />
            <Text style={styles.trackerLabel}>Water</Text>
          </TouchableOpacity>

          {/* Sleep */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="bed-outline" size={28} color="#FFC107" />
            <Text style={styles.trackerLabel}>Sleep</Text>
          </TouchableOpacity>

          {/* Medicine */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="medkit-outline" size={28} color="#FF5722" />
            <Text style={styles.trackerLabel}>Medicine</Text>
          </TouchableOpacity>

          {/* Menstrual Cycle */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="female-outline" size={28} color="#E91E63" />
            <Text style={styles.trackerLabel}>Menstrual</Text>
          </TouchableOpacity>

          {/* Weight Tracker */}
          <TouchableOpacity style={styles.trackerBox}>
            <Ionicons name="scale-outline" size={28} color="#9C27B0" />
            <Text style={styles.trackerLabel}>Weight</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default DailyTrackers;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    color: '#333',
  },
  trackersRow: {
    flexDirection: 'row',
  },
  trackerBox: {
    alignItems: 'center',
    marginRight: 25, // Spacing between icons
  },
  trackerLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
  },
});
