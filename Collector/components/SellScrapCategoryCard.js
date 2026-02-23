import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import ScrapItemRow from "./ScrapItemRow"; // your row component
import { COLORS } from "../constants/colors";

export default function SellScrapCategoryCard({
  category,
  items,        // array of item names
  dataObj,      // items state object
  config,       // scrapConfig
  expanded,
  toggleCategory,
  toggleItem,
  updateQty,
  updateWeight,
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Category Header */}
      <TouchableOpacity
        onPress={() => toggleCategory(category)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 12,
          borderRadius: 12,
          backgroundColor: expanded === category ? "#E5F4EA" : "#F3F4F6",
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 16, color: COLORS.textPrimary }}>
          {category}
        </Text>
        {expanded === category ? <ChevronUp /> : <ChevronDown />}
      </TouchableOpacity>

      {/* Item list */}
      {expanded === category && (
        <>
          {/* Heading row */}
          <View style={{ flexDirection: "row", marginTop: 8, paddingHorizontal: 4 }}>
            <Text style={{ flex: 1, fontWeight: "600", color: COLORS.textPrimary }}>Item</Text>
            {(category === "Paper" || category === "Metal") ? (
              <Text style={{ width: 110, textAlign: "center", fontWeight: "600", color: COLORS.textPrimary }}>Weight (kg)</Text>
            ) : (
              <Text style={{ width: 90, textAlign: "center", fontWeight: "600", color: COLORS.textPrimary }}>Qty</Text>
            )}
          </View>

          {/* Items */}
          {items.map((item) => (
            <ScrapItemRow
              key={item}
              item={item}
              data={dataObj}
              config={config}
              onToggle={toggleItem}
              onQtyChange={updateQty}
              onWeightChange={updateWeight}
            />
          ))}
        </>
      )}
    </View>
  );
}
