import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register } from "../../services/auth"; // ✅ use auth service

const AccountSetupScreen = () => {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email && password && confirmPassword && password === confirmPassword;

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (password && val !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async () => {
    if (!isFormValid || !phoneNumber) return;

    try {
      setLoading(true);
      const data = await register({
        email,
        password,
        phoneNumber: String(phoneNumber), // in case it's not already a string
      });
      
      if (data?.access_token) {
        await AsyncStorage.setItem("token", data.access_token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.push("/profileSetup");
      } else {
        Alert.alert("Registration Failed", "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to register. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={require("../../assets/images/onboarding.png")} style={styles.image} />

          <Text style={styles.title}>You're Almost There!</Text>
          <Text style={styles.subtitle}>Just a few details before we begin your journey.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (confirmPassword && val !== confirmPassword) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholderTextColor="#999"
            />

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, (!isFormValid || loading) && { opacity: 0.5 }]}
            disabled={!isFormValid || loading}
            onPress={handleRegister}
          >
            <AntDesign name="arrowright" size={20} color="#fff" />
            <Text style={styles.buttonText}>Let’s Go</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AccountSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  inner: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    fontFamily: "Poppins-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#000",
    marginBottom: 4,
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
    marginTop: 4,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
