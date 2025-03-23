import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Dummy Data for banners
const banners = [
  {
    id: '1',
    title: 'Daily Challenge',
    subtitle: 'Do your plan before 09:00 AM',
    image: 'https://via.placeholder.com/150', // Placeholder image
  },
  {
    id: '2',
    title: 'Hydration Goal',
    subtitle: 'Drink 8 glasses of water today!',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Workout Reminder',
    subtitle: 'Don’t miss your workout today!',
    image: 'https://via.placeholder.com/150',
  },
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Track index on swipe
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  });

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.bannerCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.profileGroup}>
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
                <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/55.jpg' }} style={styles.avatar} />
                <Text style={styles.moreText}>+4</Text>
              </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.bannerImage} />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                opacity: currentIndex === index ? 1 : 0.3,
                width: currentIndex === index ? 10 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
        carouselContainer: {
        marginTop: 8, // Space between header and banner
      },
  bannerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: width * 0.85,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
});

export default BannerCarousel;
