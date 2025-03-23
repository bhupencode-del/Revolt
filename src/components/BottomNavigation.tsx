import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const BottomNavigation = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Dashboard */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.label}>Dashboard</Text>
        </TouchableOpacity>

        {/* Plans */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.label}>Plans</Text>
        </TouchableOpacity>

        {/* Food Logs */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="restaurant-outline" size={24} color="#fff" />
          <Text style={styles.label}>Food Log</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.label}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40, // Lift up a little for modern UI effect
    left: 20,
    right: 20,
    borderRadius: 30,
    backgroundColor: '#333', // Dark background for navbar
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
});

export default BottomNavigation;
