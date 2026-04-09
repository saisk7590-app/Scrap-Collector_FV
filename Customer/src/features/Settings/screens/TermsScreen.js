import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import { useAppTheme } from "@context/ThemeContext";

const clauses = [
  "Use of this app is intended for booking, tracking, and managing scrap pickups.",
  "By continuing, you agree to follow local regulations and avoid submitting prohibited materials.",
  "Services are provided on a best-effort basis; schedules may change based on availability.",
  "These terms are under development and will be updated with detailed legal language soon.",
];

export default function TermsScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms & Conditions" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {clauses.map((text, index) => (
            <Text key={index} style={styles.paragraph}>
              {text}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 28,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.text,
    },
  });
