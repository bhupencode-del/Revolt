import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router"; // ✅ Fixed Import

const ProfileSetupScreen = () => {
  const router = useRouter(); // ✅ Correctly Initialize Router
  const [fullName, setFullName] = useState("");

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image source={require("../../assets/images/profile_setup.png")} style={styles.image} />

      <Text style={styles.title}>Let's get started with your profile.</Text>

      {/* Full Name Input */}
      <Text style={styles.label}>What's your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Full Name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/fitnessGoals")}>
        <Text style={styles.nextText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: "150%", height: 430, resizeMode: "contain", marginBottom: 10, marginTop: -60 },
  title: { fontSize: 18, fontWeight: "regular", color: "#000", marginBottom: 20, textAlign: "left", alignSelf: "flex-start" },
  label: { fontSize: 16, color: "#000", alignSelf: "flex-start", marginBottom: 5 },
  input: { width: "100%", borderWidth: 1, borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  nextButton: { width: "100%", backgroundColor: "#4DCFFF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 100 },
  nextText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default ProfileSetupScreen;


