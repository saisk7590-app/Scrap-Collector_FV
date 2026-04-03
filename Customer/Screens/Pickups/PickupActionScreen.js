import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Minus, ArrowLeft, Search, X } from "lucide-react-native";
import { apiRequest } from "../../src/lib/api";

export default function PickupActionScreen({ navigation, route }) {
  const pickup = route?.params?.pickup;
  
  const [allScrapItems, setAllScrapItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(false);

  // ===== FETCH ALL ITEMS FOR ADDITION =====
  const fetchAllItems = async () => {
    try {
      setFetchingItems(true);
      const res = await apiRequest("/data/items");
      if (res.scrapConfig) {
        const itemArray = Object.keys(res.scrapConfig).map(name => ({
          name,
          ...res.scrapConfig[name]
        }));
        setAllScrapItems(itemArray);
      }
    } catch (err) {
      console.log("Error fetching items:", err);
    } finally {
      setFetchingItems(false);
    }
  };

  React.useEffect(() => {
    fetchAllItems();
  }, []);

  if (!pickup) {
    return (
      <View style={styles.center}>
        <Text>Pickup data not found</Text>
      </View>
    );
  }

  // ===== INITIAL ITEMS =====
  const initialItems = React.useMemo(() => {
    const list = Array.isArray(pickup.items)
      ? pickup.items
      : typeof pickup.items === "string"
      ? JSON.parse(pickup.items)
      : [];

    return list.map((item) => ({
      pickupItemId: item.pickupItemId || item.pickup_item_id || null,
      itemId: item.itemId || item.item_id || null,
      categoryId: item.categoryId || item.category_id || null,
      category: item.name,
      price: item.price || 0,
      expectedWeight: item.weight || item.quantity || 0,
      actualWeight: item.weight || item.quantity || 0,
      pricingType:
        item.type || (item.weight > 0 ? "weight" : "quantity"),
    }));
  }, [pickup]);

  const [items, setItems] = useState(initialItems);
  const [remarks, setRemarks] = useState("");

  // ===== UPDATE FUNCTIONS =====
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

  const updateCategory = (index, value) => {
    const updated = [...items];
    updated[index].category = value;
    updated[index].categoryId = null;
    setItems(updated);
  };

  const onSelectItem = (item) => {
    setItems([
      ...items,
      {
        pickupItemId: null,
        itemId: item.id || null,
        categoryId: item.category_id || null,
        category: item.name,
        price: item.price || 0,
        expectedWeight: 0,
        actualWeight: 0,
        pricingType: item.type === 'quantity' ? 'quantity' : 'weight',
      },
    ]);
    setShowItemModal(false);
  };

  const filteredItems = allScrapItems.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===== TOTALS =====
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

      {/* ITEM SELECTION MODAL */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Item to Add</Text>
              <TouchableOpacity onPress={() => setShowItemModal(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {fetchingItems ? (
              <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.itemOption}
                    onPress={() => onSelectItem(item)}
                  >
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMeta}>Price: ₹{item.price} / {item.type === 'weight' ? 'kg' : 'unit'}</Text>
                    </View>
                    <Plus size={20} color="#2563EB" />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CUSTOMER */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Customer</Text>
          <Text style={styles.infoValue}>
            {pickup.customer_name || pickup.customerName || 'N/A'}
          </Text>
        </View>

        {/* ✅ REMARKS */}
        <View style={styles.remarksCard}>
          <Text style={styles.infoLabel}>
            Remarks (Optional)
          </Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Add notes (mixed scrap, damage, etc.)"
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </View>

        {/* HEADER + ADD ITEM */}
        <View style={styles.addItemRow}>
          <Text style={styles.sectionTitle}>
            Scrap Details
          </Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowItemModal(true)}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* ITEMS */}
        {items.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* CATEGORY EDIT */}
            <TextInput
              style={styles.categoryInput}
              value={item.category}
              onChangeText={(text) =>
                updateCategory(index, text)
              }
            />

            <Text style={styles.price}>
              ₹{item.price} /{" "}
              {item.pricingType === "weight"
                ? "kg"
                : "unit"}
            </Text>

            <View style={styles.compareRow}>
              {/* CUSTOMER */}
              <View style={styles.box}>
                <Text style={styles.boxLabel}>
                  Customer Given
                </Text>
                <Text style={styles.boxValue}>
                  {item.expectedWeight}{" "}
                  {item.pricingType === "weight"
                    ? "kg"
                    : "unit"}
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
                    onPress={() =>
                      updateWeight(
                        index,
                        item.pricingType === "weight"
                          ? -0.5
                          : -1
                      )
                    }
                  >
                    <Minus size={16} />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.input}
                    value={item.actualWeight.toString()}
                    onChangeText={(v) =>
                      setWeight(index, v)
                    }
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={styles.controlBtnPrimary}
                    onPress={() =>
                      updateWeight(
                        index,
                        item.pricingType === "weight"
                          ? 0.5
                          : 1
                      )
                    }
                  >
                    <Plus size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.boxAmount}>
                  ₹{item.actualWeight * item.price}
                </Text>

                <Text style={styles.unitText}>
                  Unit:{" "}
                  {item.pricingType === "weight"
                    ? "kg"
                    : "unit"}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* TOTALS */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Customer Expected Total
          </Text>
          <Text style={styles.totalValue}>
            ₹{customerTotal}
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Collector Calculated Total
          </Text>
          <Text style={styles.totalValue}>
            ₹{collectorTotal}
          </Text>
        </View>

        {/* FINAL */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Final Amount
          </Text>
          <Text style={styles.summaryAmount}>
            ₹{collectorTotal}
          </Text>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.generateBtn,
            collectorTotal === 0 && {
              backgroundColor: "#9ca3af",
            },
          ]}
          disabled={collectorTotal === 0}
          onPress={() =>
            navigation.navigate("Invoice", {
              pickup,
              items,
              remarks, // ✅ pass remarks
              totalAmount: collectorTotal,
            })
          }
        >
          <Text style={styles.generateText}>
            Generate Invoice
          </Text>
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  remarksCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  remarksInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },

  infoLabel: { color: "#6b7280", fontSize: 12 },
  infoValue: { fontSize: 16, fontWeight: "600" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  addItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  addBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  addBtnText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  categoryInput: {
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

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

  boxValue: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },

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

  unitText: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
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
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
  },

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

  generateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#111827',
  },
  itemOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
