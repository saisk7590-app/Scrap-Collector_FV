import React, { useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock } from "lucide-react-native";

import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../src/lib/api";

export default function SchedulePickupScreen({ navigation, route }) {
  const { items, alternateNumber } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(true);

  // Generate 7 days starting from today
  const dates = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  React.useEffect(() => {
    fetchTimeSlots();
    // Default to Today
    setSelectedDate(dates[0]);
  }, [dates]);

  const fetchTimeSlots = async () => {
    try {
      const data = await apiRequest("/data/time-slots");
      if (data.timeSlots) {
        // Map DB format {id, slot_text} to component format {id, time}
        setTimeSlots(data.timeSlots.map(s => ({ id: s.id, time: s.slot_text })));
      }
    } catch (err) {
      console.log("Error fetching time slots:", err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);

  const handleConfirm = async () => {
    if (loading) return;

    if (!selectedSlot || !selectedDate) {
      Alert.alert("Required", "Please select both date and time slot");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      await apiRequest("/pickups/create", "POST", {
        items: items,
        totalQty,
        totalWeight,
        alternateNumber: alternateNumber || null,
        timeSlot: selectedSlot.time,
        pickupDate: formattedDate,
        city: "Hyderabad",
      });

      // ✅ Replace screen (prevents back navigation)
      navigation.replace("Success", {
        time: selectedSlot.time,
        date: formattedDate,
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                     {item.quantity > 0 && <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>Qty {item.quantity}</Text>}
                     {item.quantity > 0 && item.weight > 0 && <Text style={{ fontSize: 12, color: COLORS.textSecondary }}> • </Text>}
                     {item.weight > 0 && <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.weight} kg</Text>}
                  </View>
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

            {/* DATE SELECTOR */}
            <Text style={{ fontSize: 16, fontWeight: "600", marginHorizontal: 16, marginBottom: 10 }}>
              Select Pickup Date
            </Text>
            <View style={{ paddingLeft: 16, marginBottom: 20 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={dates}
                keyExtractor={(item) => item.toISOString()}
                renderItem={({ item }) => {
                  const isSelected = selectedDate?.toDateString() === item.toDateString();
                  const isToday = new Date().toDateString() === item.toDateString();
                  const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === item.toDateString();
                  
                  let dayLabel = item.toLocaleDateString("en-US", { weekday: "short" });
                  if (isSelected && isToday) dayLabel = "Today";
                  else if (isToday) dayLabel = "Today";
                  else if (isTomorrow) dayLabel = "Tomorrow";

                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedDate(item)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: isSelected ? COLORS.primary : "#F3F4F6",
                        marginRight: 10,
                        alignItems: "center",
                        minWidth: 80,
                        borderWidth: 1,
                        borderColor: isSelected ? COLORS.primary : COLORS.border
                      }}
                    >
                      <Text style={{ color: isSelected ? "white" : COLORS.textSecondary, fontSize: 12 }}>{dayLabel}</Text>
                      <Text style={{ color: isSelected ? "white" : COLORS.textPrimary, fontWeight: "700", fontSize: 18 }}>{item.getDate()}</Text>
                      <Text style={{ color: isSelected ? "white" : COLORS.textSecondary, fontSize: 12 }}>{item.toLocaleDateString("en-US", { month: "short" })}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <Text style={{ fontSize: 16, fontWeight: "600", marginHorizontal: 16, marginBottom: 10 }}>
              Select Pickup Time
            </Text>
            {slotsLoading && (
              <ActivityIndicator color={COLORS.primary} style={{ marginBottom: 10 }} />
            )}
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
