import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useAppTheme } from "@context/ThemeContext";

export default function ChangePasswordScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak password", "New password should be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }

    Alert.alert("Password Updated", "Your password has been updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change Password" showBack />

      <View style={styles.content}>
        <Text style={styles.lead}>Secure your account with a strong password.</Text>

        <CustomInput
          placeholder="Current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secure
          style={styles.input}
        />
        <CustomInput
          placeholder="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          secure
          style={styles.input}
        />
        <CustomInput
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure
          style={styles.input}
        />

        <CustomButton title="Update Password" onPress={handleUpdate} />
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
    lead: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 8,
    },
    input: {
      marginBottom: 12,
    },
  });
