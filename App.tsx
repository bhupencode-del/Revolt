import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Hello, Wellzspire App!</Text>
    </View>
  );
}
