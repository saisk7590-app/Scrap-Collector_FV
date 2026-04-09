import React from "react";
import { View, Text, TouchableOpacity } from "react-native"; // ✅ FIX

import { RADIUS, SPACING, COLORS } from "@constants";
import { getCategoryIcon } from "@utils/assetHelpers";

export default function CategoryCard({
  title,
  icon,     // emoji string
  iconBg,
  cardBg,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: "48%",
        padding: SPACING.md,
        borderRadius: RADIUS.xl,
        backgroundColor: cardBg || "#FFFFFF",
        marginBottom: SPACING.md,
      }}
    >
      {/* Emoji Icon */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS.md,
          backgroundColor: iconBg || "#E5E7EB",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {getCategoryIcon(icon, 24, COLORS.textPrimary)}
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: COLORS.textPrimary, // ✅ optional improvement
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}