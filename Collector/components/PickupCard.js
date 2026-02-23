import { View, Text } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../constants";

export default function PickupCard({ data }) {
  const isCompleted = data.status === "completed";

  return (
    <View
      style={{
        backgroundColor: isCompleted
          ? COLORS.cardLight
          : COLORS.pendingCard,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            {data.scrapType}
          </Text>
          <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
            ID: {data.display_id || data.id?.slice(0, 6)}
          </Text>
          <Text
            style={{
              color: COLORS.textSecondary,
              marginTop: 2,
            }}
          >
            {data.quantity} kg
          </Text>
        </View>

        {isCompleted && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TrendingUp size={14} color={COLORS.primary} />
            <Text
              style={{
                marginLeft: 4,
                color: COLORS.primary,
                fontWeight: "700",
              }}
            >
              ₹{data.amount}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={{
          color: COLORS.textMuted,
          fontSize: 12,
          marginTop: SPACING.xs,
        }}
      >
        {data.date}
      </Text>
    </View>
  );
}
