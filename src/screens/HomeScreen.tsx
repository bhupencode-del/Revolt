import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/config/config';
import { useFocusEffect } from '@react-navigation/native';

import BannerCarousel from '../components/BannerCarousel';
import BottomNavigation from '../components/BottomNavigation';
import TrackMealSum from '../components/TrackMealSum';
import HabitCreationCard from '../components/HabitCreationCard';
import DailyTrackers from '../components/DailyTrackers';
import WeeklyProgressSummary from '../components/WeeklyProgressSum';

const HomeScreen = () => {
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState('');
  const [mealSummary, setMealSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `Today, ${today.toLocaleDateString('en-US', options)}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;
  
          const res = await fetch(`${BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const data = await res.json();
          if (res.ok) {
            setUserName(data.name || 'User');
            if (data.profileImage) {
              setProfileImage(data.profileImage);
            }
          } else {
            console.warn('Failed to fetch profile:', data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      const fetchMealSummary = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;
  
          const res = await fetch(`${BASE_URL}/meal-log/today`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const data = await res.json();
          if (res.ok) {
            setMealSummary({
              calories: Math.round(data.totalCalories || 0),
              protein: Math.round(data.totalProtein || 0),
              carbs: Math.round(data.totalCarbs || 0),
              fats: Math.round(data.totalFats || 0),
            });
          } else {
            console.warn('Failed to fetch meal summary:', data);
          }
        } catch (error) {
          console.error('Error fetching meal summary:', error);
        }
      };
  
      fetchUserProfile();
      fetchMealSummary();
    }, [])
  );
  

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <LinearGradient colors={['#F5F7FA', '#DDE5ED']} style={styles.gradientBackground}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ✅ Header */}
          <View style={styles.headerContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : { uri: 'https://i.pravatar.cc/100' }
              }
              style={styles.profileImage}
            />

            <View style={styles.centerContent}>
              <Text style={styles.greetingText}>Hello, {userName}</Text>
              <Text style={styles.dateText}>{getFormattedDate()}</Text>
            </View>

            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          {/* ✅ Main Content */}
          <BannerCarousel />
          <TrackMealSum {...mealSummary} />
          <HabitCreationCard />
          <DailyTrackers />
          <WeeklyProgressSummary />
        </ScrollView>

        <BottomNavigation />
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50, // ✅ No SafeAreaView needed
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#607D8B',
    marginTop: 2,
  },
  notificationIcon: {
    padding: 5,
  },
});
