import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { BASE_URL } from "@/config/config";


const OnboardingScreen = () => {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!phoneNumber) return;
  
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
  
      const data = await response.json();
  
      if (data.exists) {
        Alert.alert("Account Exists", "This phone number is already registered. Please sign in.", [
          { text: "OK", onPress: () => router.replace("/signin") },
        ]);
      } else {
        router.push({ pathname: "/accountsetup", params: { phoneNumber } });
      }
    } catch (error) {
      console.error("Phone check error:", error);
      Alert.alert("Error", "Something went wrong. Try again later.");
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
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <Image source={require("../../assets/images/onboarding.png")} style={styles.image} />
          <Text style={styles.title}>Welcome to Habbitly</Text>
          <Text style={styles.subtitle}>Your personal companion for health and fitness</Text>

          <Text style={styles.label}>Let’s get started</Text>

          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.flagBox}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withCallingCodeButton={false}
                withModal
                withAlphaFilter
                onSelect={(country: Country) => {
                  setCountryCode(country.cca2 as CountryCode);
                  setCallingCode("+" + country.callingCode[0]);
                }}
              />
            </TouchableOpacity>

            <View style={styles.phoneBox}>
              <Text style={styles.callingCode}>{callingCode}</Text>
              <TextInput
                style={styles.phoneInput}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[styles.nextButton, !phoneNumber && { opacity: 0.4 }]}
              onPress={handleNext}
              disabled={!phoneNumber || loading}
            >
              <AntDesign name="arrowright" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace("/signin")} style={{ marginTop: 40 }}>
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

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
    width: 390,
    height: 400,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 14,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  flagBox: {
    width: 60,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    marginRight: 10,
  },
  phoneBox: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  callingCode: {
    fontSize: 16,
    color: "#333",
    marginRight: 6,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  signInLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
