import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Minus, ArrowLeft } from "lucide-react-native";

export default function PickupActionScreen({ navigation, route }) {
  const pickup = route?.params?.pickup;

  if (!pickup) {
    return (
      <View style={styles.center}>
        <Text>Pickup data not found</Text>
      </View>
    );
  }

  // ✅ Parse items from pickup data
  const initialItems = React.useMemo(() => {
    const list = Array.isArray(pickup.items) ? pickup.items : (
      typeof pickup.items === 'string' ? JSON.parse(pickup.items) : []
    );
    // Map to the format needed by the screen
    return list.map(item => ({
      category: item.name,
      price: item.price || 15, // Default price fallback
      expectedWeight: item.weight || item.quantity || 0,
      actualWeight: item.weight || item.quantity || 0,
      pricingType: item.weight > 0 ? 'weight' : 'quantity'
    }));
  }, [pickup]);

  const [items, setItems] = useState(initialItems);

  const updateWeight = (index, change) => {
    const updated = [...items];
    updated[index].actualWeight = Math.max(
      0,
      (updated[index].actualWeight || 0) + change
    );
    setItems(updated);
  };

  const setWeight = (index, value) => {
    const updated = [...items];
    updated[index].actualWeight = parseFloat(value) || 0;
    setItems(updated);
  };

  const customerTotal = items.reduce(
    (sum, i) => sum + i.expectedWeight * i.price,
    0
  );

  const collectorTotal = items.reduce(
    (sum, i) => sum + i.actualWeight * i.price,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CUSTOMER INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Customer</Text>
          <Text style={styles.infoValue}>{pickup.customerName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Scrap Details</Text>

        {items.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.itemTitle}>{item.category}</Text>
            <Text style={styles.price}>₹{item.price} / kg</Text>

            {/* SIDE BY SIDE */}
            <View style={styles.compareRow}>
              {/* CUSTOMER */}
              <View style={styles.box}>
                <Text style={styles.boxLabel}>Customer Given</Text>
                <Text style={styles.boxValue}>
                  {item.expectedWeight} kg
                </Text>
                <Text style={styles.boxAmount}>
                  ₹{item.expectedWeight * item.price}
                </Text>
              </View>

              {/* COLLECTOR */}
              <View style={styles.box}>
                <Text style={styles.boxLabelCollector}>
                  Collector Measured
                </Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => updateWeight(index, -0.5)}
                  >
                    <Minus size={16} />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.input}
                    value={item.actualWeight.toString()}
                    onChangeText={(v) => setWeight(index, v)}
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={styles.controlBtnPrimary}
                    onPress={() => updateWeight(index, 0.5)}
                  >
                    <Plus size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.boxAmount}>
                  ₹{item.actualWeight * item.price}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* TOTALS */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Customer Expected Total</Text>
          <Text style={styles.totalValue}>₹{customerTotal}</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Collector Calculated Total</Text>
          <Text style={styles.totalValue}>₹{collectorTotal}</Text>
        </View>

        {/* FINAL SUMMARY (UNCHANGED) */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Final Amount</Text>
          <Text style={styles.summaryAmount}>₹{collectorTotal}</Text>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.generateBtn,
            collectorTotal === 0 && { backgroundColor: "#9ca3af" },
          ]}
          disabled={collectorTotal === 0}
          onPress={() =>
            navigation.navigate("Invoice", {
              pickup,
              items,
              totalAmount: collectorTotal,
            })
          }
        >
          <Text style={styles.generateText}>Generate Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scroll: { padding: 20, paddingBottom: 120 },

  header: {
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerTitle: { fontSize: 16, fontWeight: "700" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  infoLabel: { color: "#6b7280", fontSize: 12 },
  infoValue: { fontSize: 16, fontWeight: "600" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  itemTitle: { fontSize: 16, fontWeight: "600" },
  price: { color: "#6b7280", marginBottom: 10 },

  compareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    width: "48%",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 10,
  },

  boxLabel: { fontSize: 12, color: "#6b7280" },
  boxLabelCollector: { fontSize: 12, color: "#2563eb" },

  boxValue: { fontSize: 16, fontWeight: "600", marginVertical: 4 },
  boxAmount: { fontWeight: "600" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  controlBtnPrimary: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    minWidth: 50,
    textAlign: "center",
    fontWeight: "600",
  },

  totalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  totalLabel: { color: "#6b7280" },
  totalValue: { fontSize: 18, fontWeight: "700" },

  summary: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
  },

  summaryText: { color: "#6b7280" },
  summaryAmount: { fontSize: 20, fontWeight: "700" },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },

  generateBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },

  generateText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
