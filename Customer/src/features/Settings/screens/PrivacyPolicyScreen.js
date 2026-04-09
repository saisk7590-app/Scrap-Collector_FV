import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import { useAppTheme } from "@context/ThemeContext";

const placeholder = [
  "We respect your privacy and only collect information needed to deliver and improve the service.",
  "Your data is encrypted in transit and at rest. Access is limited to authorised staff for support purposes.",
  "You can request data deletion or export at any time from Account Settings.",
  "We do not sell your personal data. Third-party services are used only for analytics and notifications.",
];

export default function PrivacyPolicyScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy Policy" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {placeholder.map((text, index) => (
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
