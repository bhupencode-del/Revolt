import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image source={require("../../assets/images/signin.png")} style={styles.image} />

      <Text style={styles.title}>Welcome Back</Text>

      {/* Email/Phone Input */}
      <Text style={styles.label}>Phone no/Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email or phone"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* ✅ Log In Button (Navigates to Profile Setup) */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => router.push("/profileSetup")}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20 },
  label: { fontSize: 16, color: "#000", alignSelf: "flex-start", marginBottom: 5 },
  input: { width: "100%", borderWidth: 1, borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  loginButton: { width: "100%", backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  loginText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  forgotPassword: { color: "blue", marginTop: 10, fontSize: 14 },
});

export default SignInScreen;
