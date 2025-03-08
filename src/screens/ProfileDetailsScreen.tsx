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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // ✅ Date Picker
import Icon from "react-native-vector-icons/MaterialIcons"; // ✅ Icons for UI
import { router } from "expo-router";

const ProfileDetailsScreen = () => {
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [city, setCity] = useState<string>("");

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* ✅ Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>Page 3 of 4</Text>
          </View>

          {/* ✅ Title */}
          <Text style={styles.title}>Let's get to know you better!</Text>

          {/* ✅ Date of Birth Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.inputText}>{dob ? dob.toDateString() : "Select Date of Birth"}</Text>
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

          {/* ✅ Gender Selection */}
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
                    name={gender === option ? "check-circle" : "radio-button-unchecked"}
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

          {/* ✅ Height Input */}
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
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>

          {/* ✅ Weight Input */}
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
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>

          {/* ✅ Language Known Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Language Known</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter languages (e.g., English, Hindi)"
                placeholderTextColor="#999"
                value={language}
                onChangeText={setLanguage}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>

          {/* ✅ City You Live In Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>City You Live In</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your city"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>

          {/* ✅ Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/medicalConditions")}>
            <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ✅ Fixed: Added missing gender styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F2F5FC", alignItems: "center", padding: 20 },

  progressContainer: { width: "90%", alignItems: "center", marginVertical: 15 },
  progressBar: { width: "100%", height: 10, borderRadius: 10, backgroundColor: "#D0D0D0", overflow: "hidden" },
  progressFill: { width: "75%", height: "100%", backgroundColor: "#007AFF", borderRadius: 10 },
  progressText: { marginTop: 10, fontSize: 14, color: "#333", fontWeight: "bold" },

  title: { fontSize: 20, fontWeight: "regular", color: "#1C1B1B", marginBottom: 20, textAlign: "center" },

  inputWrapper: { width: "100%", marginBottom: 12 }, 
  label: { fontSize: 14, fontWeight: "bold", color: "#666", marginBottom: 5 }, 
  
  inputContainer: { flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: "#ccc", height: 50, justifyContent: "space-between" }, 
  
  textInput: { fontSize: 16, color: "#333", width: "100%", textAlign: "center" }, 

  inputText: { fontSize:16, color:"#333", textAlign:"center", flex: 1},


  genderContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 5 },
  genderOption: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 10 },
  genderOptionSelected: { backgroundColor: "#007AFF", borderRadius: 10 },
  genderText: { fontSize: 16, marginLeft: 8, color: "#007AFF", fontWeight: "500" },
  genderTextSelected: { color: "#fff" },

  nextButton: { width: "100%", backgroundColor: "#4DCFFF", paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 10 },
  nextText: { fontSize: 18, fontWeight: "bold", color: "white" },
});

export default ProfileDetailsScreen;