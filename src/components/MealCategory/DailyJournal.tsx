import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const DailyJournal = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={styles.journalContainer}>
      <Text style={styles.journalTitle}>📝 Daily Journal</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write your thoughts, mood, or anything..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={5}
        style={styles.journalInput}
        textAlignVertical="top"
        blurOnSubmit={true}
        returnKeyType="done"
      />
    </View>
  );
};

export default DailyJournal;

const styles = StyleSheet.create({
  journalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    elevation: 2,
    marginBottom: 60, // 👈 important to avoid blank space
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  journalInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
});
