import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Languages } from "lucide-react-native";

import Header from "@components/Header";
import OptionItem from "@components/OptionItem";
import { useAppTheme } from "@context/ThemeContext";

const languages = ["English", "Hindi"];

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const handlePress = (lang) => {
    Alert.alert("Language feature coming soon", `${lang} support will be available in a future update.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Language" showBack />

      <View style={styles.content}>
        <Text style={styles.helper}>Choose your preferred language.</Text>
        <View style={styles.card}>
          {languages.map((lang) => (
            <OptionItem
              key={lang}
              title={lang}
              icon={<Languages />}
              iconColor={colors.icon}
              onPress={() => handlePress(lang)}
            />
          ))}
        </View>
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
      gap: 12,
    },
    helper: {
      color: colors.textMuted,
      fontSize: 14,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
  });
