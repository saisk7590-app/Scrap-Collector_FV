import React, { useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock } from "lucide-react-native";

import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../src/lib/api";

const timeSlots = [
  { id: "1", time: "10:00 AM – 12:00 PM" },
  { id: "2", time: "12:00 PM – 2:00 PM" },
  { id: "3", time: "2:00 PM – 4:00 PM" },
];

export default function SchedulePickupScreen({ navigation, route }) {
  const { items, alternateNumber } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert("Select Time", "Please select a pickup time slot");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/pickups/create", "POST", {
        items: items,
        totalQty,
        totalWeight,
        alternateNumber: alternateNumber || null,
        timeSlot: selectedSlot.time,
        city: "Hyderabad",
      });

      // ✅ Replace screen (prevents back navigation)
      navigation.replace("Success", {
        time: selectedSlot.time,
        items,
        alternateNumber,
      });

    } catch (err) {
      console.log("Pickup Schedule Error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
        <Header
          variant="main"
          title="Schedule Pickup"
          showBack
        />
      </SafeAreaView>

      <FlatList
        data={timeSlots}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 14,
                padding: 16,
                margin: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 12 }}>
                Pickup Summary
              </Text>

              {items.map((item, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
                    Qty {item.quantity} • {item.weight} kg
                  </Text>
                </View>
              ))}

              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.border,
                  marginVertical: 12,
                }}
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text>Total Items</Text>
                <Text>{totalQty}</Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text>Total Weight</Text>
                <Text style={{ color: COLORS.primary }}>{totalWeight} kg</Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: "600", marginHorizontal: 16, marginBottom: 10 }}>
              Select Pickup Time
            </Text>
          </>
        }
        renderItem={({ item }) => {
          const active = selectedSlot?.id === item.id;

          return (
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  marginHorizontal: 16,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: active ? COLORS.primary : COLORS.border,
                  backgroundColor: active ? "#E5F4EA" : COLORS.white,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: active ? COLORS.primary : "#9CA3AF",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {active && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: COLORS.primary,
                        }}
                      />
                    )}
                  </View>

                  <Clock
                    size={18}
                    color={active ? COLORS.primary : COLORS.textSecondary}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color: active ? COLORS.primary : "#374151",
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>

              <Text
                onPress={() => setSelectedSlot(item)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </View>
          );
        }}
        ListFooterComponent={
          <>
            <View
              style={{
                backgroundColor: "#EFF6FF",
                borderWidth: 1,
                borderColor: "#DBEAFE",
                borderRadius: 12,
                padding: 14,
                margin: 16,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#1E3A8A", fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: "600" }}>Note:</Text> Our licensed
                collector will arrive within the selected time window. Please
                ensure items are ready for collection.
              </Text>
            </View>

            <CustomButton
              title="Confirm Pickup"
              onPress={handleConfirm}
              variant="primary"
              disabled={!selectedSlot}
              loading={loading}
            />
          </>
        }
      />
    </View>
  );
}
