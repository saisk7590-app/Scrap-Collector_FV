import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { ChevronLeft, Bell } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../constants";

export default function Header({
  variant = "default", // "default" | "home" | "main"
  title,
  userName,
  subtitle = "Let's make the world cleaner today!",
  rightAction = null,
  showBack = "auto",
  onNotificationPress = () => {},
  backgroundColor,
  textColor,
}) {
  const navigation = useNavigation();
  const routesLength = useNavigationState((state) => state.routes.length);
  const shouldShowBack = showBack === "auto" ? routesLength > 1 : showBack;

  /* ================= HOME HEADER ================= */
  if (variant === "home") {
    return (
      <View
        style={{
          backgroundColor: COLORS.primary,
          padding: SPACING.lg,
          paddingBottom: 36,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Hello, {userName ? userName : "User"}
          </Text>

          <Text style={{ color: "#D1FAE5", marginTop: 4 }}>
            {subtitle}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNotificationPress}
          style={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.pill,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bell size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= MAIN HEADER ================= */
  if (variant === "main") {
    return (
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SPACING.md,
          backgroundColor: backgroundColor || COLORS.primary,
        }}
      >
        {shouldShowBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={textColor || COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            color: textColor || COLORS.white,
          }}
        >
          {title}
        </Text>

        <View style={{ width: 24 }}>{rightAction}</View>
      </View>
    );
  }

  /* ================= DEFAULT HEADER ================= */
  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING.md,
        backgroundColor: backgroundColor || COLORS.headerLight,
      }}
    >
      {shouldShowBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={textColor || COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 18,
          fontWeight: "600",
          color: textColor || COLORS.textPrimary,
        }}
      >
        {title}
      </Text>

      <View style={{ width: 24 }}>{rightAction}</View>
    </View>
  );
}
