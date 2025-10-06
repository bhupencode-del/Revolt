import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/config";


const SignInScreen = () => {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert("Missing Fields", "Please fill all the fields");
      return;
    }

    const isEmail = emailOrPhone.includes("@");
    const payload = {
      [isEmail ? "email" : "phoneNumber"]: emailOrPhone,
      password,
    };

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      // ✅ Store token and navigate to home
      await AsyncStorage.setItem("token", data.token);
      router.replace("/"); // Home page
    } catch (err) {
      Alert.alert("Error", "Something went wrong while logging in");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Image source={require("../../assets/images/signin.png")} style={styles.image} />

        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <Text style={styles.label}>Phone no / Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone"
          placeholderTextColor="#999"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? "Logging In..." : "Log In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#3b82f6",
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
});
