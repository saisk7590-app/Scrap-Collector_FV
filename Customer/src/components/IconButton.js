import React from "react";
import { Pressable, StyleSheet } from "react-native";

const IconButton = ({
  icon,
  onPress,
  size = 40,
  backgroundColor = "transparent",
  borderRadius = 20,
  disabled = false,
  hitSlop = 10,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      {icon}
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
