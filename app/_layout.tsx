import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        {/* ✅ Main App Screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* ✅ Onboarding & Authentication Screens */}
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        
        {/* ✅ Profile Setup Screens */}
        <Stack.Screen name="profileSetup" options={{ headerShown: false }} />
        <Stack.Screen name="profileDetails" options={{ headerShown: false }} />

        {/* ✅ Fitness-Related Screens */}
        <Stack.Screen name="fitnessGoals" options={{ headerShown: false }} />
        <Stack.Screen name="fitnessLevel" options={{ headerShown: false }} />
        <Stack.Screen name="medicalConditions" options={{ headerShown: false}}/>

        {/* ✅ Not Found Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


