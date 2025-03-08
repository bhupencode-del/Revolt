import React, { useState } from "react";
import { 
  View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // Arrow icon

const OnboardingScreen = () => {
  const router = useRouter(); // ✅ Initialize router for navigation
  const [countryCode, setCountryCode] = useState<CountryCode>("IN"); // Default: India
  const [callingCode, setCallingCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Image source={require("../../assets/images/onboarding.png")} style={styles.image} />

          <Text style={styles.title}>Welcome to Wellzspire</Text>
          <Text style={styles.subtitle}>Your personal companion for Health and fitness</Text>

          <Text style={styles.label}>Let's get started!</Text>

          {/* Phone Input Section with Separate Boxes */}
          <View style={styles.inputWrapper}>
            {/* Country Picker Box */}
            <TouchableOpacity style={styles.flagBox}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withCallingCodeButton={false} // Hide country code after selection
                withModal
                withAlphaFilter
                onSelect={(country: Country) => {
                  setCountryCode(country.cca2 as CountryCode);
                  setCallingCode("+" + country.callingCode[0]); // Store calling code internally
                }}
              />
            </TouchableOpacity>

            {/* Phone Number Box */}
            <View style={styles.phoneBox}>
              <TextInput
                style={styles.phoneInput}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/profileSetup")}>
              <AntDesign name="arrowright" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Sign In Navigation */}
          <TouchableOpacity onPress={() => router.replace("/signin")}>
            <Text style={styles.signInText}>
              Have an account? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 417, height: 417, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000" },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, color: "#000", marginBottom: 10 },

  // Input Wrapper for Flag, Phone Number, and Button
  inputWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },

  // Country Flag Box
  flagBox: { 
    width: 60, 
    height: 50, 
    borderWidth: 1, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 10 
  },

  // Phone Number Box
  phoneBox: { 
    flex: 1, 
    height: 50, 
    borderWidth: 1, 
    borderRadius: 10, 
    justifyContent: "center", 
    paddingHorizontal: 15 
  },

  phoneInput: { 
    fontSize: 16 
  },

  // Next Button Beside Phone Number
  nextButton: { 
    backgroundColor: "#4CAF50", 
    padding: 10, 
    borderRadius: 50, 
    alignItems: "center", 
    justifyContent: "center", 
    marginLeft: 10 
  },

  // Sign In Styling
  signInText: { fontSize: 14, color: "#666", marginTop: 10 },
  signInLink: { color: "blue", fontWeight: "bold" },
});

export default OnboardingScreen;
