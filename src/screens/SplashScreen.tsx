import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Image source={require("../../assets/images/wellzspire_logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D6EAF8", alignItems: "center", justifyContent: "center" },
  logo: { width: 320, height: 320 },
});

export default SplashScreenComponent;
