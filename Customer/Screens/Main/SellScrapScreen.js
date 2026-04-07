import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import CustomButton from "../../components/CustomButton";
import SellScrapCategoryCard from "../../components/SellScrapCategoryCard";

import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../src/lib/api";

export default function SellScrapScreen({ navigation, route }) {
  const selectedCategory = route?.params?.category || null;
  const [expanded, setExpanded] = useState(selectedCategory?.name || null);
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
        setCategories(catData.categories);
      }

      if (itemData?.scrapData && itemData?.scrapConfig) {
        setScrapData(itemData.scrapData);
        setScrapConfig(itemData.scrapConfig);

        const initObj = {};
        Object.values(itemData.scrapData).flat().forEach((i) => {
          initObj[i.name] = { selected: false, quantity: 0, weight: "" };
        });
        setItems(initObj);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load scrap data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catName) =>
    setExpanded(expanded === catName ? null : catName);

  const toggleItem = (name) =>
    setItems({
      ...items,
      [name]: { ...items[name], selected: !items[name].selected },
    });

  const updateQty = (name, delta) => {
    const current = items[name] || { quantity: 0 };
    const newQty = Math.max(0, (current.quantity || 0) + delta);
    setItems({
      ...items,
      [name]: { ...current, quantity: newQty, selected: newQty > 0 },
    });
  };

  const updateWeight = (name, value) => {
    if (value === "") {
      setItems({
        ...items,
        [name]: { ...items[name], weight: "", selected: false },
      });
      return;
    }

    const regex = /^\d*\.?\d{0,2}$/;
    if (!regex.test(value)) return;

    setItems({
      ...items,
      [name]: {
        ...items[name],
        weight: value,
        selected: parseFloat(value) > 0,
      },
    });
  };

  const handleSubmit = async () => {
    const selectedItems = Object.keys(items)
      .filter((k) => items[k].selected)
      .map((k) => {
        const config = scrapConfig[k];

        return {
          name: k,
          quantity: items[k].quantity || 0,
          weight: parseFloat(items[k].weight) || 0,
          price: config?.price || 0, // ✅ Critical: Ensure price is stored for reports
          type: config?.type || "weight", // ✅ Match backend/collector expectation
          measurement_type: config?.type || "weight",
          categoryId: config?.category_id,
          itemId: config?.id,
        };
      });

    if (selectedItems.length === 0) {
      Alert.alert("Selection Required", "Please select at least one item to proceed.");
      return;
    }

    try {
      setSubmitLoading(true);

      const totalWeight = selectedItems.reduce((a, i) => a + (i.weight || 0), 0);
      const totalQty = selectedItems.reduce((a, i) => a + (i.quantity || 0), 0);

      const data = await apiRequest("/scrap/create", "POST", {
        items: selectedItems,
        total_weight: totalWeight,
        totalQty: totalQty,
      });

      navigation.navigate("PickupSummary", {
        items: selectedItems,
        requestId: data.scrapRequest.id,
      });
    } catch (err) {
      Alert.alert("Submission Error", "Could not create scrap request. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }}>
          <Header title="Sell Scrap" showBack onBackPress={() => navigation.goBack()} />
        </SafeAreaView>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }}>
        <Header title="Sell Scrap" showBack onBackPress={() => navigation.goBack()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {categories.map((cat) => (
          <SellScrapCategoryCard
            key={cat.id}
            category={cat}
            items={scrapData[cat.name] || []}
            dataObj={items}
            config={scrapConfig}
            expanded={expanded}
            toggleCategory={toggleCategory}
            toggleItem={toggleItem}
            updateQty={updateQty}
            updateWeight={updateWeight}
          />
        ))}
      </ScrollView>

      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        elevation: 10
      }}>
        <CustomButton
          title={submitLoading ? "Creating Request..." : "Review Selection"}
          onPress={handleSubmit}
          disabled={submitLoading}
        />
      </View>
    </View>
  );
}