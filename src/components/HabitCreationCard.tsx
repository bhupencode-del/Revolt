import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Added
import { BASE_URL } from '@/config/config';

const HabitCreationCard = () => {
  const router = useRouter();
  const [hasHabit, setHasHabit] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchHabit = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;

          const res = await fetch(`${BASE_URL}/habit`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();

          // ✅ Check if habit exists
          if (res.ok && data && data.name) {
            setHasHabit(true);
          } else {
            setHasHabit(false);
          }
        } catch (err) {
          console.log('Error fetching habit:', err);
          setHasHabit(false);
        } finally {
          setLoading(false);
        }
      };

      fetchHabit();
    }, [])
  );

  const handleAdd = () => {
    if (hasHabit) {
      router.push('/habit-created');
    } else {
      router.push('/create-habit');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>🌱</Text>
            <Text style={styles.title}>Habit Builder</Text>
          </View>
          <Text style={styles.subtitle}>Create, Repeat, Succeed.</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HabitCreationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFCFD',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
