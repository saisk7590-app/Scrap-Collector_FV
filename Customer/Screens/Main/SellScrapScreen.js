import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import SellScrapCategoryCard from "../../components/SellScrapCategoryCard";

import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../src/lib/api";

export default function SellScrapScreen({ navigation, route }) {
  const selectedCategory = route?.params?.category || null;
  const [expanded, setExpanded] = useState(selectedCategory);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [scrapData, setScrapData] = useState({});
  const [scrapConfig, setScrapConfig] = useState({});
  const [items, setItems] = useState({});

  useEffect(() => {
    fetchScrapData();
  }, []);

  const fetchScrapData = async () => {
    try {
      setLoading(true);
      const [catData, itemData] = await Promise.all([
        apiRequest("/data/categories"),
        apiRequest("/data/items"),
      ]);

      if (catData?.categories) {
        setCategories(catData.categories.map((c) => c.name));
      }

      if (itemData?.scrapData && itemData?.scrapConfig) {
        setScrapData(itemData.scrapData);
        setScrapConfig(itemData.scrapConfig);

        // Initialize state for each item (selected: false, quantity: 0, weight: "")
        const initObj = {};
        Object.values(itemData.scrapData).flat().forEach((i) => {
          initObj[i] = { selected: false, quantity: 0, weight: "" };
        });
        setItems(initObj);
      }
    } catch (err) {
      console.log("Error fetching dynamic scrap data:", err);
      Alert.alert("Error", "Could not load scrap items.");
    } finally {
      setLoading(false);
    }
  };

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
      .map((k) => {
        const config = scrapConfig[k];
        let measurementType = 'weight';
        if (config?.hasWeight && config?.hasQuantity) {
            measurementType = (parseFloat(items[k].weight) > 0) ? 'weight' : 'quantity';
        } else if (config?.hasQuantity) {
            measurementType = 'quantity';
        }

        return {
          name: k,
          quantity: items[k].quantity || 0,
          weight: parseFloat(items[k].weight) || 0,
          price: config?.price || 0,
          measurement_type: measurementType,
          categoryId: config?.category_id,
          itemId: config?.id
        };
      });

    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please select at least one item");
      return;
    }

    try {
      setSubmitLoading(true);

      const totalWeight = selectedItems.reduce((acc, i) => acc + i.weight, 0);
      const totalQty = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

      const data = await apiRequest("/scrap/create", "POST", {
        items: selectedItems,
        total_weight: totalWeight,
        totalQty: totalQty
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
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
          <Header variant="main" title="Sell Scrap" showBack />
        </SafeAreaView>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
        <Header variant="main" title="Sell Scrap" showBack />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {categories.map((cat) => (
          <SellScrapCategoryCard
            key={cat}
            category={cat}
            items={scrapData[cat] || []}
            dataObj={items}
            config={scrapConfig}
            expanded={expanded}
            toggleCategory={toggleCategory}
            toggleItem={toggleItem}
            updateQty={updateQty}
            updateWeight={updateWeight}
          />
        ))}

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <CustomButton
            title={submitLoading ? "Processing..." : "Sell Scrap"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
