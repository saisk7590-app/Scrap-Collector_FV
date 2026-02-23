import React, { useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import SellScrapCategoryCard from "../../components/SellScrapCategoryCard";

import { COLORS } from "../../constants/colors";
import { SCRAP_CATEGORIES, SCRAP_DATA, SCRAP_CONFIG } from "../../constants/scrap";
import { apiRequest } from "../../src/lib/api";

export default function SellScrapScreen({ navigation, route }) {
  const selectedCategory = route?.params?.category || null;
  const [expanded, setExpanded] = useState(selectedCategory);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState(() => {
    const obj = {};
    Object.values(SCRAP_DATA).flat().forEach((i) => {
      obj[i] = { selected: false, quantity: 0, weight: "" };
    });
    return obj;
  });

  const toggleCategory = (cat) => setExpanded(expanded === cat ? null : cat);

  const toggleItem = (name) =>
    setItems({ ...items, [name]: { ...items[name], selected: !items[name].selected } });

  const updateQty = (name, delta) => {
    const qty = Math.max(0, items[name].quantity + delta);
    setItems({ ...items, [name]: { ...items[name], quantity: qty, selected: qty > 0 } });
  };

  const updateWeight = (name, value) => {
    if (value === "") {
      setItems({ ...items, [name]: { ...items[name], weight: "", selected: false } });
      return;
    }

    const regex = /^\d*\.?\d{0,2}$/;
    if (!regex.test(value)) return;

    setItems({
      ...items,
      [name]: { ...items[name], weight: value, selected: parseFloat(value) > 0 },
    });
  };

  const handleSubmit = async () => {
    const selectedItems = Object.keys(items)
      .filter((k) => items[k].selected)
      .map((k) => ({
        name: k,
        quantity: items[k].quantity,
        weight: parseFloat(items[k].weight) || 0,
      }));

    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please select at least one item");
      return;
    }

    try {
      setLoading(true);

      const totalWeight = selectedItems.reduce((acc, i) => acc + i.weight, 0);

      const data = await apiRequest("/scrap/create", "POST", {
        items: selectedItems,
        totalWeight,
      });

      if (data.scrapRequest) {
        // Navigate with request_id
        navigation.navigate("PickupSummary", {
          items: selectedItems,
          requestId: data.scrapRequest.id,
        });
      } else {
        throw new Error("Failed to get scrap request data from server");
      }

    } catch (err) {
      console.log("SellScrap Submit Error:", err);
      Alert.alert("Request Failed", err.message || "Could not create scrap request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
        <Header variant="main" title="Sell Scrap" showBack />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {SCRAP_CATEGORIES.map((cat) => (
          <SellScrapCategoryCard
            key={cat}
            category={cat}
            items={SCRAP_DATA[cat]}
            dataObj={items}
            config={SCRAP_CONFIG}
            expanded={expanded}
            toggleCategory={toggleCategory}
            toggleItem={toggleItem}
            updateQty={updateQty}
            updateWeight={updateWeight}
          />
        ))}

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <CustomButton
            title={loading ? "Processing..." : "Sell Scrap"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
