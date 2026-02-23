import { View, Text } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../constants";

export default function PickupCard({ data }) {
  const isCompleted = data.status === "completed";

  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : "";

  const getItemDisplayValue = (item) => {
    // Weight-based item
    if (item.weight && item.weight > 0) {
      return `${item.weight} kg`;
    }

    // Quantity-based item (support multiple possible keys)
    if (item.qty && item.qty > 0) {
      return `${item.qty} pcs`;
    }

    if (item.quantity && item.quantity > 0) {
      return `${item.quantity} pcs`;
    }

    // If nothing exists
    return "—";
  };

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
      <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
        Pickup ID: {data.display_id || data.id.slice(0, 6)}
      </Text>
      {/* ITEMS */}
      {Array.isArray(data.items) &&
        data.items.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              {item.name}
            </Text>

            <Text style={{ color: COLORS.textSecondary }}>
              {getItemDisplayValue(item)}
            </Text>
          </View>
        ))}

      {/* AMOUNT */}
      {isCompleted && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SPACING.xs,
          }}
        >
          <TrendingUp size={14} color={COLORS.primary} />
          <Text
            style={{
              marginLeft: 4,
              color: COLORS.primary,
              fontWeight: "700",
            }}
          >
            ₹{data.amount || 0}
          </Text>
        </View>
      )}

      {/* DATE */}
      <Text
        style={{
          color: COLORS.textMuted,
          fontSize: 12,
          marginTop: SPACING.xs,
        }}
      >
        {formattedDate}
      </Text>
    </View>
  );
}
