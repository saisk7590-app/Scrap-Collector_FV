// components/ContactCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../constants/theme";

export default function ContactCard({ title, phone, email, hours }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Phone: {phone}</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Text style={styles.text}>Hours: {hours}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 30,
    padding: THEME.padding,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: THEME.textMain,
  },
  text: {
    fontSize: 14,
    color: THEME.textMain,
    marginBottom: 4,
  },
});
