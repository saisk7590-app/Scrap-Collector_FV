import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Calendar, MapPin, Wallet, Package } from "lucide-react-native";

import { apiRequest } from "../../src/lib/api";

export default function PickupHistoryScreen({ navigation }) {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest("/pickups/history");
      setCompletedPickups(data.pickups || []);
    } catch (err) {
      console.log("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = completedPickups.reduce(
    (sum, p) => sum + Number(p.amount || 0),
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
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
        ) : completedPickups.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>No completed pickups yet</Text>
        ) : (
          completedPickups.map((pickup) => (
            <View key={pickup.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.customerName}>
                    {pickup.customer_name || 'Customer'}
                  </Text>
                  <Text style={styles.scrapType}>
                    ID: {pickup.display_id || pickup.id.slice(0, 6)}
                  </Text>
                  <Text style={styles.scrapType}>
                    {Array.isArray(pickup.items) 
                      ? pickup.items.map(i => i.name).join(', ') 
                      : (typeof pickup.items === 'string' 
                          ? JSON.parse(pickup.items).map(i => i.name).join(', ') 
                          : 'Scrap Items')}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end", minWidth: 80 }}>
                  <Text style={styles.earning} numberOfLines={1}>₹{pickup.amount || 0}</Text>
                  <Text style={styles.completedBadge}>Completed</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.rowText}>
                    {pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString() : 
                     (pickup.created_at ? new Date(pickup.created_at).toLocaleDateString() : 'N/A')}
                  </Text>
                </View>

                <View style={styles.rowItem}>
                  <Package size={14} color="#6B7280" />
                  <Text style={styles.rowText}>
                    {pickup.total_weight || 0} kg
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.rowItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.address}>
                  {[
                    pickup.house_no,
                    pickup.address,
                    pickup.area,
                    pickup.pincode,
                    pickup.city
                  ].filter(Boolean).join(', ') || 'Address not provided'}
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.time}>{pickup.time_slot || 'Anytime'}</Text>
                <Text
                  style={[
                    styles.payment,
                    styles.cash
                  ]}
                >
                  Cash
                </Text>
              </View>
            </View>
          ))
        )}
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
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "right",
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
