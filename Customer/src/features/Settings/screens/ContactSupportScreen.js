import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import CustomButton from "@components/CustomButton";
import { useAppTheme } from "@context/ThemeContext";

export default function ContactSupportScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Empty message", "Please describe your issue before submitting.");
      return;
    }
    Alert.alert("Support request submitted");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contact Support" showBack />

      <View style={styles.content}>
        <Text style={styles.helper}>Share details so our team can assist you faster.</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Type your message..."
          placeholderTextColor={colors.textSoft}
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <CustomButton title="Submit" onPress={handleSubmit} />
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
      gap: 16,
    },
    helper: {
      color: colors.textMuted,
      fontSize: 14,
    },
    textArea: {
      minHeight: 160,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 14,
      color: colors.text,
      backgroundColor: colors.surface,
      textAlignVertical: "top",
      fontSize: 14,
      lineHeight: 20,
    },
  });
