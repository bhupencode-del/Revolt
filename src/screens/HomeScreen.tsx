import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BannerCarousel from '../components/BannerCarousel';
import BottomNavigation from '../components/BottomNavigation';
import TrackMealSum from '../components/TrackMealSum';
import HabitCreationCard from '../components/HabitCreationCard';
import DailyTrackers from '../components/DailyTrackers';
import WeeklyProgressSummary from '../components/WeeklyProgressSum';
import { useNavigation } from '@react-navigation/native';



const HomeScreen = () => {
  const [userName, setUserName] = useState('User');

  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `Today, ${today.toLocaleDateString('en-US', options)}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        const data = {
          name: 'John Doe', // Mock data
          profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
        };
        setUserName(data.name);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F5E9' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }} // Fix for scroll issue
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Profile Picture */}
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
            style={styles.profileImage}
          />

          {/* Name and Date Centered */}
          <View style={styles.centerContent}>
            <Text style={styles.greetingText}>Hello, Bhupen</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>

          {/* Notification Icon */}
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <BannerCarousel />
        <TrackMealSum />
        <HabitCreationCard />
        <DailyTrackers />
        <WeeklyProgressSummary />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  notificationIcon: {
    padding: 5,
  },
  bodyContent: {
    paddingVertical: 20,
  },
});
