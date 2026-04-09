import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Package,
  User,
} from "lucide-react-native";
import { apiRequest } from "@lib/api";
import { COLORS } from "@constants/colors";

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
              <User size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Customer Name</Text>
              <Text style={styles.value}>{pickup.customer_name || pickup.customerName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Phone size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 4 }}>
                <Text style={styles.link}>{pickup.customer_phone || pickup.alternate_number || 'N/A'}</Text>
                
                {(pickup.customer_phone || pickup.alternate_number) && (
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity 
                      onPress={() => Linking.openURL(`tel:${pickup.customer_phone || pickup.alternate_number}`)}
                      style={styles.actionIcon}
                    >
                      <Phone size={16} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => Linking.openURL(`sms:${pickup.customer_phone || pickup.alternate_number}`)}
                      style={styles.actionIcon}
                    >
                      <MessageSquare size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <MapPin size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pickup Address</Text>
              <Text style={styles.value}>
                {[
                  pickup.house_no,
                  pickup.address || pickup.customer_address,
                  pickup.area,
                  pickup.pincode,
                  pickup.city
                ].filter(Boolean).join(', ') || 'N/A'}
              </Text>
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
              <Text style={styles.label}>Scheduled Date</Text>
              <Text style={styles.value}>
                {pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString() : 
                 (pickup.pickupDate ? new Date(pickup.pickupDate).toLocaleDateString() : 
                  (pickup.created_at ? new Date(pickup.created_at).toLocaleDateString() : 'N/A'))}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock size={18} color="#2563EB" />
            <View>
              <Text style={styles.label}>Time Slot</Text>
              <Text style={styles.value}>{pickup.time_slot || pickup.timeSlot || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* REQUESTED ITEMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requested Items</Text>

          <FlatList
            data={itemsList}
            keyExtractor={(item, index) => String(item.id || item.name || index)}
            renderItem={({ item }) => {
              const price = parseFloat(item.price) || 0;
              const measure = item.weight || item.quantity || 0;
              const amount = measure * price;

              return (
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Package size={18} color="#2563EB" />
                    <View>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: '#6B7280' }}>
                        ₹{price.toFixed(2)} / {item.type === 'weight' ? 'kg' : 'unit'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.qty}>
                      {item.type === 'weight' 
                        ? `${measure} kg` 
                        : `${measure} unit(s)`}
                    </Text>
                    <Text style={{ fontWeight: '600', color: '#111827' }}>
                      ₹{amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '700', color: '#111827' }}>Estimated Total</Text>
                <Text style={{ fontWeight: '700', color: '#2563EB' }}>
                  ₹{itemsList.reduce((sum, item) => sum + (parseFloat(item.weight || item.quantity || 0) * parseFloat(item.price || 0)), 0).toFixed(2)}
                </Text>
              </View>
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      {pickup.status?.toLowerCase() === "scheduled" && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={async () => {
              try {
                const res = await apiRequest(`/pickups/${pickup.id}/status`, "PUT", {
                  status: "in_progress",
                });
                if (res.pickup) {
                  // Update local state or navigate
                  alert("Pickup Accepted! Customer has been notified.");
                  navigation.goBack(); // Go back to dashboard to see updated list
                }
              } catch (err) {
                alert("Failed to accept pickup");
              }
            }}
          >
            <Text style={styles.startText}>Accept & Notify Customer</Text>
          </TouchableOpacity>
        </View>
      )}

      {pickup.status?.toLowerCase() === "in_progress" && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate("PickupAction", { pickup })}
          >
            <Text style={styles.startText}>Start Verification</Text>
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

  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
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
  acceptButton: {
    height: 52,
    backgroundColor: "#10B981", // Emerald green for acceptance
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

