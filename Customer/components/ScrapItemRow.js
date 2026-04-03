import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { COLORS } from "../constants/colors";

export default function ScrapItemRow({ item, config, data, onQtyChange, onWeightChange, onToggle }) {
  const isSelected = data[item].selected;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderColor: COLORS.border }}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => onToggle(item)}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: COLORS.textSecondary,
            marginRight: 8,
            backgroundColor: isSelected ? COLORS.primary : "transparent",
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.textPrimary, fontWeight: "500" }}>{item}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>₹{config[item]?.price || 0} / {config[item]?.type === "weight" ? "kg" : "unit"}</Text>
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        {config[item]?.hasQuantity && (
          <View style={{ flexDirection: "row", alignItems: "center", width: 110, justifyContent: "center" }}>
            <TouchableOpacity 
              onPress={() => onQtyChange(item, -1)} 
              style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center", borderRadius: 6, backgroundColor: "#F3F4F6" }}
            >
              <Minus size={16} />
            </TouchableOpacity>

            <TextInput
              style={{ width: 40, height: 36, borderWidth: 1, borderColor: "#D1D5DB", textAlign: "center", marginHorizontal: 4, borderRadius: 6 }}
              keyboardType="numeric"
              value={String(data[item].quantity || 0)}
              onChangeText={(t) => onQtyChange(item, (parseInt(t) || 0) - (data[item].quantity || 0))}
            />

            <TouchableOpacity 
              onPress={() => onQtyChange(item, 1)} 
              style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center", borderRadius: 6, backgroundColor: "#F3F4F6" }}
            >
              <Plus size={16} />
            </TouchableOpacity>
          </View>
        )}

        {config[item]?.hasWeight && (
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: config[item]?.hasQuantity ? 10 : 0 }}>
            <TextInput
              style={{ width: 60, height: 36, borderWidth: 1, borderColor: "#D1D5DB", textAlign: "center", borderRadius: 6 }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              value={data[item].weight}
              onChangeText={(t) => onWeightChange(item, t)}
            />
            <Text style={{ marginLeft: 4, fontSize: 13, color: COLORS.textSecondary }}>kg</Text>
          </View>
        )}
      </View>
    </View>
  );
}
