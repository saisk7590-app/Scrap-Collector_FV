import { View, Text } from "react-native";
import { COLORS, SPACING } from "../constants";

export default function SectionHeader({ icon: Icon, title, color }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.sm,
        marginTop: SPACING.lg,
      }}
    >
      <Icon size={16} color={color} />
      <Text
        style={{
          marginLeft: SPACING.xs,
          fontSize: 16,
          fontWeight: "600",
          color: COLORS.textPrimary,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
