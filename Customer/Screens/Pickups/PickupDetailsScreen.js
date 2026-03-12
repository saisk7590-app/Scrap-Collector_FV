import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
} from "lucide-react-native";

export default function PickupDetailsScreen({ navigation, route }) {
  const { pickup } = route.params;

  // Real items check - pickup.items comes from DB
  const itemsList = Array.isArray(pickup.items) ? pickup.items : (
    typeof pickup.items === 'string' ? JSON.parse(pickup.items) : []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#111827" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup: {pickup.display_id || pickup.id.slice(0, 6)}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* STATUS */}
        <View style={styles.statusWrap}>
          <Text
            style={[
              styles.statusBadge,
              pickup.status === "Pending"
                ? styles.pending
                : styles.completed,
            ]}
          >
            {pickup.status}
          </Text>
        </View>

        {/* CUSTOMER INFO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Phone size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.label}>Customer Name</Text>
              <Text style={styles.value}>{pickup.customerName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Phone size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.link}>{pickup.customerPhone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <MapPin size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pickup Address</Text>
              <Text style={styles.value}>{pickup.address}</Text>
            </View>
          </View>
        </View>

        {/* MAP */}
        <View style={styles.card}>
          <View style={styles.mapBox}>
            <MapPin size={32} color="#9CA3AF" />
            <Text style={styles.mapText}>Map View</Text>
          </View>
        </View>

        {/* SCHEDULE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule</Text>

          <View style={styles.infoRow}>
            <Calendar size={18} color="#2563EB" />
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{pickup.pickupDate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock size={18} color="#2563EB" />
            <View>
              <Text style={styles.label}>Time Slot</Text>
              <Text style={styles.value}>{pickup.timeSlot}</Text>
            </View>
          </View>
        </View>

        {/* REQUESTED ITEMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requested Items</Text>

          {itemsList.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Package size={18} color="#2563EB" />
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
              <Text style={styles.qty}>Qty: {item.quantity}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      {pickup.status?.toLowerCase() === "scheduled" && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate("PickupAction", { pickup })}
          >
            <Text style={styles.startText}>Start Pickup</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    height: 56,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  scroll: {
    padding: 16,
    paddingBottom: 120,
  },

  statusWrap: {
    alignItems: "center",
    marginBottom: 16,
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "600",
  },

  pending: {
    backgroundColor: "#FFEDD5",
    color: "#C2410C",
  },

  completed: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    color: "#111827",
  },

  link: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },

  mapBox: {
    height: 160,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  mapText: {
    marginTop: 6,
    color: "#6B7280",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemText: {
    fontSize: 14,
    color: "#111827",
  },

  qty: {
    fontSize: 12,
    color: "#6B7280",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  startButton: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  startText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
