import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Check, Wallet, CreditCard, Printer, Share2 } from "lucide-react-native";

import { printInvoice } from "@utils/invoicePrint";
import { apiRequest } from "@lib/api";

export default function InvoiceScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Accepting data exactly as sent from PickupActionScreen
  const { pickup, items = [], remarks = "", totalAmount = 0 } = route.params || {};

  // If no pickup is sent, show fallback
  if (!pickup) {
    return (
      <View style={styles.center}>
        <Text>No pickup data available</Text>
      </View>
    );
  }

  const [paymentMode, setPaymentMode] = useState("cash");

  const totalWeight = items.reduce(
    (sum, item) => sum + (item.actualWeight || item.weight || 0),
    0
  );

  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
  const invoiceDate = new Date().toLocaleDateString("en-IN");

  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [collector, setCollector] = useState({ name: "Collector", id: "COL-..." });

  React.useEffect(() => {
    fetchCollectorProfile();
  }, []);

  const fetchCollectorProfile = async () => {
    try {
      const data = await apiRequest("/profile");
      if (data.profile) {
        setCollector({
          name: data.profile.fullName || "Collector",
          id: `COL-${String(data.profile.id).slice(0, 6).toUpperCase()}`,
        });
      }
    } catch (err) {
      console.log("Error fetching profile for invoice", err);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await apiRequest(`/pickups/${pickup.id}/status`, "PUT", {
        status: "completed",
        remarks: remarks || "Completed successfully",
        finalItems: items.map(item => ({
          pickup_item_id: item.pickupItemId || item.pickup_item_id || null,
          item_id: item.itemId || item.item_id || null,
          collector_category_id: item.categoryId || item.category_id || null,
          collector_weight: item.actualWeight || 0,
          price: item.price || 0,
          is_modified: item.actualWeight !== item.expectedWeight || item.category !== item.originalCategory,
          remarks: item.remarks || "",
        })),
      });

      Alert.alert("Success", "Pickup completed & invoice saved");
      navigation.navigate("CollectorDashboard");
    } catch (err) {
      console.error("Complete Pickup Error:", err);
      const message = err?.message || "Could not complete pickup. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await printInvoice({
        invoiceNumber,
        invoiceDate,
        customerName: pickup.customerName,
        customerPhone: pickup.customerPhone,
        customerAddress: pickup.address || "N/A",
        collectorName: collector.name,
        collectorId: collector.id,
        items,
        totalAmount,
        totalWeight,
        paymentMode,
        paymentStatus: "Paid",
      });
    } catch (err) {
      const msg = err?.message?.includes("Another share request")
        ? "Please wait for the previous share to finish."
        : err?.message || "Unable to share invoice right now.";
      Alert.alert("Share Invoice", msg);
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Preview</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <ActionButton
            icon={<Printer size={18} />}
            label="Print"
            onPress={() =>
              printInvoice({
                invoiceNumber,
                invoiceDate,
                customerName: pickup.customerName,
                customerPhone: pickup.customerPhone,
                customerAddress: pickup.address || "N/A",
                collectorName: collector.name,
                collectorId: collector.id,
                items,
                totalAmount,
                totalWeight,
                paymentMode,
                paymentStatus: "Paid",
              })
            }
          />
          <ActionButton
            icon={<Share2 size={18} />}
            label={sharing ? "Sharing..." : "Share"}
            onPress={handleShare}
            disabled={sharing}
          />
        </View>

        {/* INVOICE CARD */}
        <View style={styles.card}>
          <View style={styles.invoiceTop}>
            <View>
              <Text style={styles.lightText}>Invoice Number</Text>
              <Text style={styles.invoiceNo}>{invoiceNumber}</Text>
              <Text style={styles.lightText}>Date: {invoiceDate}</Text>
            </View>
            <Check color="white" size={28} />
          </View>

          <InfoBlock
            title="Customer Details"
            line1={pickup.customerName}
            line2={pickup.customerPhone}
          />

          <InfoBlock
            title="Collected By"
            line1={collector.name}
            line2={`Collector ID: ${collector.id}`}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scrap Details</Text>

            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View>
                  <Text>{item.category || item.name}</Text>
                  <Text style={styles.muted}>
                    {item.pricingType === "quantity"
                      ? `${item.actualWeight || item.quantity} pcs × ₹${item.price}`
                      : `${item.actualWeight || item.weight} kg × ₹${item.price}`}
                  </Text>
                </View>
                <Text>₹{(item.actualWeight || item.weight || 0) * (item.price || 0)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <Row label="Total Weight" value={`${totalWeight} kg`} />
            <Row label="Total Items" value={items.length} />
            <View style={styles.totalRow}>
              <Text>Total Amount</Text>
              <Text style={styles.total}>₹{totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* PAYMENT */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Mode</Text>

          <View style={styles.paymentRow}>
            <PaymentButton
              active={paymentMode === "cash"}
              icon={<Wallet size={20} />}
              label="Cash"
              onPress={() => setPaymentMode("cash")}
            />
            <PaymentButton
              active={paymentMode === "online"}
              icon={<CreditCard size={20} />}
              label="Online"
              onPress={() => setPaymentMode("online")}
            />
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Check color="white" size={20} />
              <Text style={styles.confirmText}>Confirm Pickup & Save Invoice</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */
const ActionButton = ({ icon, label, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.actionBtn, disabled && { opacity: 0.5 }]}
    onPress={onPress}
    disabled={disabled}
  >
    {icon}
    <Text>{label}</Text>
  </TouchableOpacity>
);

const InfoBlock = ({ title, line1, line2 }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text>{line1}</Text>
    <Text style={styles.muted}>{line2}</Text>
  </View>
);

const PaymentButton = ({ active, icon, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.paymentBtn, active && styles.paymentActive]}
  >
    {icon}
    <Text>{label}</Text>
  </TouchableOpacity>
);

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.muted}>{label}</Text>
    <Text>{value}</Text>
  </View>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  back: { fontSize: 22 },
  headerTitle: { fontSize: 18, marginLeft: 12 },

  content: { padding: 16, paddingBottom: 120 },

  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  card: { backgroundColor: "#fff", borderRadius: 14 },
  invoiceTop: {
    backgroundColor: "#2563EB",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  lightText: { color: "#DBEAFE", fontSize: 12 },
  invoiceNo: { color: "#fff", fontSize: 18 },

  section: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  sectionTitle: { fontWeight: "600", marginBottom: 6 },
  muted: { color: "#666", fontSize: 12 },

  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },

  summary: { padding: 16, backgroundColor: "#FAFAFA" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  totalRow: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  total: { fontSize: 18, color: "#2563EB" },

  paymentCard: { backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 14 },
  paymentRow: { flexDirection: "row", gap: 12 },
  paymentBtn: { flex: 1, borderWidth: 1, padding: 16, borderRadius: 12, alignItems: "center", gap: 6 },
  paymentActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#eee" },
  confirmBtn: { backgroundColor: "#2563EB", height: 48, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  confirmText: { color: "#fff" },
});
