import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


SplashScreen.preventAutoHideAsync(); // Keep splash screen until ready

const SplashScreenComponent = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const preloadAssets = async () => {
    try {
      await Asset.loadAsync([require("../../assets/images/Background.png")]);
      setIsReady(true);
      SplashScreen.hideAsync(); 
    } catch (e) {
      console.warn("Asset loading error", e);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // 🔐 Check token validity from backend
        const res = await fetch(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          router.replace("/home"); // ✅ Token is valid → Go to home
        } else {
          await AsyncStorage.removeItem("token");
          router.replace("/signin"); // ❌ Invalid token → Go to signin
        }
      } else {
        router.replace("/onboarding"); // 🚪 No token → First time user
      }
    } catch (error) {
      console.log("Login check error:", error);
      router.replace("/signin"); // Fallback on error
    }
  };

  useEffect(() => {
    preloadAssets().then(() => {
      setTimeout(() => {
        checkLoginStatus();
      }, 1500);
    });
  }, []);

  if (!isReady) return null;

  return (
    <ImageBackground
      source={require("../../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <Image
          source={require("../../assets/images/Habbitly.png")}
          style={styles.logo}
        />
        <View style={styles.loadingBarContainer}>
          <View style={styles.loadingBar} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreenComponent;

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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
  },
  logo: {
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
  loadingBarContainer: {
    position: "absolute",
    bottom: 50,
    width: "60%",
    height: 6,
    backgroundColor: "#ffffff40",
    borderRadius: 10,
    overflow: "hidden",
  },
  loadingBar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#4CAF50",
  },
});
