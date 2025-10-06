import "react-native-reanimated"; // 👈 Always on top
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // 👈 Keeps splash until fonts are ready

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_400Regular: require("../assets/fonts/Poppins-Regular.ttf"),
    Poppins_600SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // 👈 Hide once fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          {/* ✅ Main Tab Navigation */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* ✅ Onboarding & Auth */}
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
          <Stack.Screen name="signin/index" options={{ headerShown: false }} />

          {/* ✅ Profile Setup */}
          <Stack.Screen name="accountsetup/index" options={{ headerShown: false }} />
          <Stack.Screen name="profileSetup/index" options={{ headerShown: false }} />
          <Stack.Screen name="profileDetails/index" options={{ headerShown: false }} />

          {/* ✅ Fitness Steps */}
          <Stack.Screen name="fitnessGoals/index" options={{ headerShown: false }} />
          <Stack.Screen name="fitnessLevel/index" options={{ headerShown: false }} />
          <Stack.Screen name="medicalConditions/index" options={{ headerShown: false }} />

          {/* ✅ Home */}
          <Stack.Screen name="home/index" options={{ headerShown: false }} />

          {/* ✅ Meal Tracking Flow */}
          <Stack.Screen name="mealTracking/index" options={{ headerShown: false }} />
          <Stack.Screen name="mealTracking/[category]" options={{ headerShown: false }} />
          <Stack.Screen name="mealTracking/quantity" options={{ headerShown: false }} />
          <Stack.Screen name="mealTracking/set-calorie-budget" options={{ headerShown: false }} />

          {/* ✅ Nutrition Screens */}
          <Stack.Screen name="NutritionDetails/index" options={{ headerShown: false }} />
          <Stack.Screen name="NutritionBreakdown/index" options={{ headerShown: false }} />

          {/* ✅ Not Found Fallback */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
