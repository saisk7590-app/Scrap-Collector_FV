import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../constants";

export default function WalletInfoCard({
  balance = 0,
  totalScrap = 0,
  onPress = null,
  variant = "home", // "home", "history", "wallet"
  style,
}) {
  // Determine labels based on variant
  const balanceLabel =
    variant === "wallet"
      ? "Available Balance"
      : "Total Earnings";

  const scrapLabel = "Total Scrap";

  // Styles based on variant
  const containerStyle = [
    {
      backgroundColor: variant === "history" ? "rgba(255,255,255,0.2)" : COLORS.white,
      padding: SPACING.md,
      borderRadius: RADIUS.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      ...(variant === "home" && { ...SHADOWS.card }),
    },
    style,
  ];

  const textColor = variant === "history" ? "#DCFCE7" : COLORS.textMuted;

  const Content = () => (
    <>
      <View>
        <Text style={{ fontSize: 12, color: textColor }}>{balanceLabel}</Text>
        <Text
          style={{
            fontSize: variant === "history" ? 20 : 18,
            fontWeight: "600",
            color: variant === "history" ? COLORS.white : COLORS.primary,
          }}
        >
          ₹{balance}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 12, color: textColor }}>{scrapLabel}</Text>
        <Text
          style={{
            fontSize: variant === "history" ? 20 : 16,
            fontWeight: "500",
            color: variant === "history" ? COLORS.white : COLORS.textPrimary,
          }}
        >
          {totalScrap} kg
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={containerStyle}>
        <Content />
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}><Content /></View>;
}
