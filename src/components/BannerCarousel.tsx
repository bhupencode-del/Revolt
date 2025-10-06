import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ✅ Updated Data with Realistic Images
const banners = [
  {
    id: '1',
    title: '💪 Stay Consistent',
    subtitle: 'Track meals & reach your goals!',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  },
  {
    id: '2',
    title: '🥗 Healthy Choices',
    subtitle: 'Eat fresh, feel fresh every day!',
    image: 'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg',
  },
  {
    id: '3',
    title: '🏋️ Workout Reminder',
    subtitle: 'Don’t skip today’s workout!',
    image: 'https://cdn.pixabay.com/photo/2016/11/21/16/29/sport-1846648_1280.jpg',
  },
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

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
        contentContainerStyle={{ paddingHorizontal: 5 }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <LinearGradient colors={['#f5f5f5', '#e6e6e6']} style={styles.bannerCard}>
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
          </LinearGradient>
        )}
      />

      {/* ✅ Smooth Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => {
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * width * 0.85,
              index * width * 0.85,
              (index + 1) * width * 0.85,
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: currentIndex === index ? 1 : 0.3,
                  width: currentIndex === index ? 12 : 6,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 10,
  },
  bannerCard: {
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: width * 0.85,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    color: '#222',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  bannerImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
  },
});

export default BannerCarousel;
