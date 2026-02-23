import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, FONTS } from "../constants";

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secure = false,
  style,
}) {
  const [show, setShow] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secure && !show}
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
      />

      {secure && (
        <TouchableOpacity onPress={() => setShow(!show)}>
          <MaterialIcons
            name={show ? "visibility-off" : "visibility"}
            size={22}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm, // 👈 CONTROLLED HERE
    fontSize: FONTS.size.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
});
