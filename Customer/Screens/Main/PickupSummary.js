import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { COLORS } from "../../constants/colors";

export default function PickupSummaryScreen({ navigation, route }) {
  const { items } = route.params;
  const [alternateNumber, setAlternateNumber] = useState("");

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pickup Summary</Text>

        {items.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              Qty: {item.quantity} | {item.weight} kg
            </Text>
          </View>
        ))}

        <View style={styles.totalBox}>
          <Text>Total Items: {totalQty}</Text>
          <Text>Total Weight: {totalWeight} kg</Text>
        </View>

        <View style={styles.contactBox}>
          <Text style={styles.sectionTitle}>Contact Details</Text>

          <Text style={styles.primaryText}>
            Primary: +91 9XXXXXXXXX
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
      </ScrollView>

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
