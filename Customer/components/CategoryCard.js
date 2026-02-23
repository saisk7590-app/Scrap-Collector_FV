import { TouchableOpacity, View, Text } from "react-native";
import { RADIUS, SPACING } from "../constants";

export default function CategoryCard({
  title,
  icon: Icon,
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
        backgroundColor: cardBg,
        marginBottom: SPACING.md,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS.md,
          backgroundColor: iconBg,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Icon color="#fff" size={22} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: "500" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
