import React, { useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // Prevent auto-hide

const SplashScreenComponent = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/onboarding"); // Correct path
    }, 3000);
  }, []);

  return (
    <ImageBackground 
      source={require("../../assets/images/Background.png")} // 🌄 Add your background image here
      style={styles.background}
      resizeMode="cover" // 📌 Ensures the image covers the full screen
    >
      <View style={styles.overlay}>
        <Image source={require("../../assets/images/Habbitly.png")} style={styles.logo} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Optional: Adds a dark overlay effect
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 320,
    height: 320,
  },
});

export default SplashScreenComponent;
