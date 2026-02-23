import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { RADIUS, SIZES } from "../constants";
import { BUTTON_VARIANTS } from "../constants/buttonVariants";

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
}) {
  const v = BUTTON_VARIANTS[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={{
        height: SIZES.buttonHeight,
        backgroundColor: v.backgroundColor,
        borderRadius: RADIUS.lg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        borderWidth: v.borderWidth,
        borderColor: v.borderColor,
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: 16,
      }}
    >
      {loading ? (
        <ActivityIndicator color={v.textColor} />
      ) : (
        <>
          {icon}
          <Text style={{ color: v.textColor, fontWeight: "600" }}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
