import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@/config/config";

const ProfileDetailsScreen = () => {
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const handleNext = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const payload = {
        dateOfBirth: dob,
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        languagesKnown: language,
        city,
      };

      const response = await axios.post(`${BASE_URL}/user/update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/medicalConditions");
    } catch (error) {
      console.error("Error while updating profile:", error);
      Alert.alert("Error", "Could not update profile. Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F5FC" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>Page 3 of 4</Text>
              </View>

              <Text style={styles.title}>Let's get to know you better!</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.inputText}>
                    {dob ? dob.toDateString() : "Select Date of Birth"}
                  </Text>
                  <Icon name="calendar-today" size={24} color="#007AFF" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dob || new Date()}
                    mode="date"
                    display="spinner"
                    textColor={Platform.OS === "ios" ? "#000" : undefined}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDob(selectedDate);
                    }}
                  />
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {["male", "female", "other"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        gender === option && styles.genderOptionSelected,
                      ]}
                      onPress={() => setGender(option)}
                    >
                      <Icon
                        name={
                          gender === option ? "check-circle" : "radio-button-unchecked"
                        }
                        size={20}
                        color={gender === option ? "#fff" : "#007AFF"}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          gender === option && styles.genderTextSelected,
                        ]}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Height (cm)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="Enter height (e.g., 170 cm)"
                    placeholderTextColor="#999"
                    value={height}
                    onChangeText={(value) => setHeight(value.replace(/[^0-9]/g, ""))}
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="Enter weight (e.g., 70 kg)"
                    placeholderTextColor="#999"
                    value={weight}
                    onChangeText={(value) => setWeight(value.replace(/[^0-9]/g, ""))}
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Language Known</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter languages (e.g., English, Hindi)"
                    placeholderTextColor="#999"
                    value={language}
                    onChangeText={setLanguage}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>City You Live In</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your city"
                    placeholderTextColor="#999"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.footerButtonWrapper}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextText}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    backgroundColor: "#F2F5FC",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D0D0D0",
    overflow: "hidden",
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    color: "#1C1B1B",
    marginBottom: 20,
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#666",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    justifyContent: "space-between",
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    width: "100%",
    textAlign: "left",
    fontFamily: "Poppins-Regular",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    flex: 1,
    fontFamily: "Poppins-Regular",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
  },
  genderOptionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#007AFF",
    fontFamily: "Poppins-Medium",
  },
  genderTextSelected: {
    color: "#fff",
  },
  footerButtonWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#F2F5FC",
  },
  nextButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    marginBottom: -30,
  },
  nextText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins-Bold",
  },
});
