import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";

export default function ProfileMenuItem({
  icon,
  title,
  onPress,
  textColor,
  showArrow = true,
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.left}>
        {icon}
        <Text style={[styles.text, textColor && { color: textColor }]}>{title}</Text>
      </View>

      {showArrow ? <Text style={styles.arrow}>›</Text> : null}
    </TouchableOpacity>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    text: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
    arrow: {
      fontSize: 22,
      color: colors.textSoft,
    },
  });
