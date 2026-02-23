import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { THEME } from "../constants/theme";
import { ChevronRight, ChevronDown } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OptionItem({
  title,
  icon,
  iconType = "lucide", // "lucide" or "ionicons"
  onPress,
  expandable = false,
  expanded = false,
  children,
  danger = false,
}) {
  return (
    <View>
      <TouchableOpacity
        style={[styles.row, danger && { backgroundColor: THEME.dangerBg }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconCircle,
              danger && { backgroundColor: THEME.dangerBg },
            ]}
          >
            {iconType === "lucide"
              ? React.cloneElement(icon, {
                  size: 18,
                  color: danger ? THEME.danger : THEME.primary,
                })
              : <Ionicons name={icon} size={18} color={danger ? THEME.danger : THEME.primary} />}
          </View>

          <Text style={[styles.text, danger && { color: THEME.danger }]}>
            {title}
          </Text>
        </View>

        {expandable ? (
          expanded ? (
            <ChevronDown size={20} color={THEME.primary} />
          ) : (
            <ChevronRight size={20} color={THEME.primary} />
          )
        ) : (
          <ChevronRight
            size={20}
            color={danger ? THEME.danger : THEME.primary}
          />
        )}
      </TouchableOpacity>

      {expanded && <View style={styles.subContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.rowBackground,
    padding: THEME.padding,
    borderRadius: THEME.borderRadius,
    marginBottom: 14,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.iconCircle,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 16, fontWeight: "500", color: THEME.textMain },
  subContainer: { marginLeft: 52, marginTop: 8 },
});
