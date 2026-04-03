import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { User } from "lucide-react-native";

export default function ProfileAvatar({
  uri,
  name,
  size = 88,
  backgroundColor = "#03C75A",
  textColor = "#FFFFFF",
  borderColor = "#FFFFFF",
}) {
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor,
          borderColor,
        },
      ]}
    >
      {initials ? (
        <Text style={[styles.initials, { color: textColor, fontSize: size * 0.32 }]}>
          {initials}
        </Text>
      ) : (
        <User color={textColor} size={size * 0.42} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 3,
  },
  fallback: {
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
  },
});
