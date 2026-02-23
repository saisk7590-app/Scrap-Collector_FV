import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Calendar, MapPin, Wallet, Package } from "lucide-react-native";

const completedPickups = [
  {
    id: "1",
    customerName: "Priya Sharma",
    date: "Jan 9, 2026",
    timeSlot: "8:00 AM - 9:00 AM",
    scrapType: "Paper & Plastic",
    totalWeight: 15.5,
    earnings: 850,
    address: "Jubilee Hills, Hyderabad",
    paymentMode: "Cash",
  },
  {
    id: "2",
    customerName: "Vikram Patel",
    date: "Jan 8, 2026",
    timeSlot: "4:00 PM - 5:00 PM",
    scrapType: "Metal",
    totalWeight: 22,
    earnings: 1200,
    address: "Kukatpally, Hyderabad",
    paymentMode: "Online",
  },
  {
    id: "3",
    customerName: "Anita Desai",
    date: "Jan 7, 2026",
    timeSlot: "11:00 AM - 12:00 PM",
    scrapType: "E-Waste",
    totalWeight: 8.5,
    earnings: 950,
    address: "Banjara Hills, Hyderabad",
    paymentMode: "Cash",
  },
];

export default function PickupHistoryScreen({ navigation }) {
  const totalEarnings = completedPickups.reduce(
    (sum, p) => sum + p.earnings,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup History</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Performance</Text>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Pickups</Text>
              <Text style={styles.summaryValue}>
                {completedPickups.length}
              </Text>
            </View>

            <View>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={styles.summaryValue}>
                ₹{totalEarnings.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* HISTORY LIST */}
        {completedPickups.map((pickup) => (
          <View key={pickup.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.customerName}>
                  {pickup.customerName}
                </Text>
                <Text style={styles.scrapType}>
                  ID: {pickup.display_id || pickup.id.slice(0, 6)}
                </Text>
                <Text style={styles.scrapType}>
                  {pickup.scrapType}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.earning}>₹{pickup.earnings}</Text>
                <Text style={styles.completedBadge}>Completed</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Calendar size={14} color="#6B7280" />
                <Text style={styles.rowText}>{pickup.date}</Text>
              </View>

              <View style={styles.rowItem}>
                <Package size={14} color="#6B7280" />
                <Text style={styles.rowText}>
                  {pickup.totalWeight} kg
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.address}>{pickup.address}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.time}>{pickup.timeSlot}</Text>
              <Text
                style={[
                  styles.payment,
                  pickup.paymentMode === "Cash"
                    ? styles.cash
                    : styles.online,
                ]}
              >
                {pickup.paymentMode}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

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

  scroll: { padding: 16 },

  summaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  summaryTitle: {
    color: "#FFF",
    fontWeight: "600",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    color: "#DBEAFE",
    fontSize: 12,
  },

  summaryValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  scrapType: {
    fontSize: 12,
    color: "#6B7280",
  },

  earning: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },

  completedBadge: {
    fontSize: 11,
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  rowText: { fontSize: 12, color: "#6B7280" },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  address: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  time: { fontSize: 11, color: "#9CA3AF" },

  payment: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  cash: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  online: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
  },
});
