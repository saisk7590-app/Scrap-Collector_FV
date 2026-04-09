import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@components/CustomButton";
import { COLORS } from "@constants/colors";
import { getStoredUser } from "@lib/api";

export default function PickupSummaryScreen({ navigation, route }) {
  const { items } = route.params;
  const [alternateNumber, setAlternateNumber] = useState("");
  const [userPhone, setUserPhone] = useState("");

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getStoredUser();
    if (user) {
      setUserPhone(user.phone || user.mobile || "N/A");
    }
  };

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);

  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          Price: ₹{item.price || 0} / {item.type === 'weight' ? 'kg' : 'unit'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.meta}>
          {item.type === 'weight' 
            ? `${item.weight} kg` 
            : `${item.quantity} units`}
        </Text>
        <Text style={{ fontWeight: '600', color: COLORS.primary }}>
          ₹{((item.weight || item.quantity || 0) * (item.price || 0)).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <>
      <View style={styles.totalBox}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.muted}>Total Weight:</Text>
          <Text style={{ fontWeight: '600' }}>{totalWeight} kg</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Estimated Total:</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary }}>
            ₹{items.reduce((sum, item) => sum + (item.weight || item.quantity || 0) * (item.price || 0), 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.sectionTitle}>Contact Details</Text>

        <Text style={styles.primaryText}>
          Primary: +91 {userPhone}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Add alternate mobile number (optional)"
          keyboardType="number-pad"
          maxLength={10}
          value={alternateNumber}
          onChangeText={setAlternateNumber}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={items}
        keyExtractor={(_, i) => `item-${i}`}
        renderItem={renderItem}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={<Text style={styles.title}>Pickup Summary</Text>}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <CustomButton
          title="Schedule Pickup"
          onPress={() =>
            navigation.navigate("SchedulePickup", {
              items,
              alternateNumber,
              totalQty,
              totalWeight,
            })
          }
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: 16, paddingBottom: 140 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },

  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  name: { fontWeight: "500" },
  meta: { color: COLORS.textSecondary, fontSize: 12 },

  totalBox: { marginTop: 16, gap: 4 },

  contactBox: { marginTop: 24, gap: 10 },
  sectionTitle: { fontWeight: "600", fontSize: 14 },
  primaryText: { color: "#374151", fontSize: 13 },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});
