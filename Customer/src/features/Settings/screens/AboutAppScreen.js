import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import { useAppTheme } from "@context/ThemeContext";

export default function AboutAppScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="About App" showBack />

      <View style={styles.content}>
        <Text style={styles.appName}>Scrap Collector</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          Scrap Collector connects households and collectors to make recycling effortless. Track pickups,
          manage payouts, and keep your community cleaner with transparent, real-time updates.
        </Text>
      </View>
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
      flex: 1,
      padding: 20,
      gap: 8,
    },
    appName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    version: {
      color: colors.textMuted,
      fontSize: 13,
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },
  });
