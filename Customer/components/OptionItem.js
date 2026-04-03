import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

export default function OptionItem({
  title,
  subtitle,
  icon,
  iconType = "lucide",
  onPress,
  expandable = false,
  expanded = false,
  children,
  danger = false,
  iconColor,
  hideChevron = false,
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const resolvedIconColor = iconColor || (danger ? colors.danger : colors.icon);

  return (
    <View>
      <TouchableOpacity
        style={[styles.row, danger && { backgroundColor: colors.dangerSoft }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: danger ? colors.dangerSoft : colors.surfaceAlt,
              },
            ]}
          >
            {iconType === "lucide"
              ? React.cloneElement(icon, { size: 18, color: resolvedIconColor })
              : <Ionicons name={icon} size={18} color={resolvedIconColor} />}
          </View>

          <View style={styles.textWrap}>
            <Text style={[styles.text, danger && { color: colors.danger }]}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {hideChevron ? null : expandable ? (
          expanded ? (
            <ChevronDown size={20} color={resolvedIconColor} />
          ) : (
            <ChevronRight size={20} color={resolvedIconColor} />
          )
        ) : (
          <ChevronRight size={20} color={resolvedIconColor} />
        )}
      </TouchableOpacity>

      {expanded ? <View style={styles.subContainer}>{children}</View> : null}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      borderRadius: 16,
      marginBottom: 12,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      paddingRight: 12,
    },
    iconCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
    },
    textWrap: {
      flex: 1,
    },
    text: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    subContainer: {
      marginLeft: 18,
      marginBottom: 4,
    },
  });
