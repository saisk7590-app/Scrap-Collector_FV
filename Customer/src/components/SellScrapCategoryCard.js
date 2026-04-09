import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import ScrapItemRow from "./ScrapItemRow";
import { COLORS } from "@constants/colors";
import { getCategoryIcon } from "@utils/assetHelpers";

/**
 * Component to display a scrap category with expandable item list.
 * 
 * @param {object} category - { id, name, icon_name, icon_bg }
 * @param {Array} items - List of items in this category [{ id, name, image, ... }]
 */
export default function SellScrapCategoryCard({
  category,
  items,
  dataObj,
  config,
  expanded,
  toggleCategory,
  toggleItem,
  updateQty,
  updateWeight,
}) {
  const isOpen = expanded === category.name;

  return (
    <View style={{ marginBottom: 16 }}>
      {/* CATEGORY HEADER */}
      <TouchableOpacity
        onPress={() => toggleCategory(category.name)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          borderRadius: 14,
          backgroundColor: isOpen ? "#ECFDF5" : "#F9FAFB",
          borderWidth: 1,
          borderColor: isOpen ? "#10B98133" : "#F3F4F6",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* ICON BOX */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: category.icon_bg || "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              elevation: isOpen ? 1 : 0,
            }}
          >
            {getCategoryIcon(category.icon_name, 22, COLORS.primary)}
          </View>

          {/* NAME */}
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              color: COLORS.textPrimary || "#111827",
            }}
          >
            {category.name}
          </Text>
        </View>

        {isOpen ? (
          <ChevronUp size={20} color={COLORS.textSecondary || "#6B7280"} />
        ) : (
          <ChevronDown size={20} color={COLORS.textSecondary || "#6B7280"} />
        )}
      </TouchableOpacity>

      {/* ITEM LIST */}
      {isOpen && (
        <View style={{ marginTop: 4, paddingHorizontal: 4 }}>
          {/* HEADER ROW */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              marginBottom: 4,
              paddingHorizontal: 8,
            }}
          >
            <Text style={{ flex: 1, fontWeight: "700", color: "#9CA3AF", fontSize: 11, letterSpacing: 0.5 }}>ITEMS</Text>
            <Text style={{ width: 100, textAlign: "center", fontWeight: "700", color: "#9CA3AF", fontSize: 11, letterSpacing: 0.5 }}>
              {(items.length > 0 && items[0].measurement_type === 'weight') ? 'WEIGHT (KG)' : 'QUANTITY'}
            </Text>
          </View>

          {/* ITEM ROWS */}
          {items.map((item) => (
            <ScrapItemRow
              key={item.id}
              item={item} // Full item object with image support
              data={dataObj}
              config={config}
              onToggle={toggleItem}
              onQtyChange={updateQty}
              onWeightChange={updateWeight}
            />
          ))}
        </View>
      )}
    </View>
  );
}