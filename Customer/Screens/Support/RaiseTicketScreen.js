import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RaiseTicketScreen({ navigation }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitTicket = () => {
    Alert.alert("Ticket Submitted", "Your support ticket has been submitted successfully.");
    setSubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Raise a Ticket</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Describe your issue"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={submitTicket}>
          <Text style={styles.buttonText}>Submit Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  label: { fontSize: 14, fontWeight: "500", color: "#111", marginBottom: 6 },
  input: { backgroundColor: "#FFF", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14 },
  button: { backgroundColor: "#2563EB", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
});
