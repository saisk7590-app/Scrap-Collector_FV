import { View, Text } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../constants";

export default function PickupCard({ data }) {
  const isCompleted = data.status === "completed";

  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : "";

  const getItemDisplayValue = (item) => {
    // Check for type field first (new standardized structure)
    if (item.type === 'weight') {
      return `${item.weight || 0} kg`;
    }
    if (item.type === 'quantity' || item.type === 'unit') {
      return `${item.quantity || item.qty || 0} pcs`;
    }

    // Fallback logic for legacy data
    if (item.weight && item.weight > 0) return `${item.weight} kg`;
    if (item.qty && item.qty > 0) return `${item.qty} pcs`;
    if (item.quantity && item.quantity > 0) return `${item.quantity} pcs`;

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
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                {item.name}
              </Text>
              {item.price > 0 && (
                <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                  ₹{item.price} / {item.type === 'weight' ? 'kg' : 'unit'}
                </Text>
              )}
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: COLORS.textSecondary }}>
                {getItemDisplayValue(item)}
              </Text>
              {item.price > 0 && (
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textPrimary }}>
                  ₹{((item.weight || item.quantity || item.qty || 0) * item.price).toFixed(2)}
                </Text>
              )}
            </View>
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
