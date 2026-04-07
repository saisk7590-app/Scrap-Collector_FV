import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { COLORS } from "../constants/colors";
import { getItemImage } from "../utils/assetHelpers";

export default function ScrapItemRow({
  item,        // now item is OBJECT { name, image }
  config,
  data,
  onQtyChange,
  onWeightChange,
  onToggle,
}) {
  const name = item.name;
  const isSelected = data[name]?.selected;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {/* LEFT SIDE (Image + Checkbox + Name) */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => onToggle(name)}
      >
        {/* ✅ ITEM IMAGE */}
        <Image
          source={getItemImage(item.image, item.category_name)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            marginRight: 8,
          }}
        />

        {/* Checkbox */}
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: COLORS.textSecondary,
            marginRight: 8,
            backgroundColor: isSelected ? COLORS.primary : "transparent",
            borderRadius: 4,
          }}
        />

        {/* Name + Price */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.textPrimary,
              fontWeight: "500",
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}
          >
            ₹{config[name]?.price || 0} /{" "}
            {config[name]?.type === "weight" ? "kg" : "unit"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* RIGHT SIDE (Controls) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* QUANTITY */}
        {config[name]?.hasQuantity && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: 110,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => onQtyChange(name, -1)}
              style={{
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 6,
                backgroundColor: "#F3F4F6",
              }}
            >
              <Minus size={16} />
            </TouchableOpacity>

            <TextInput
              style={{
                width: 40,
                height: 36,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                textAlign: "center",
                marginHorizontal: 4,
                borderRadius: 6,
              }}
              keyboardType="numeric"
              value={String(data[name]?.quantity || 0)}
              onChangeText={(t) =>
                onQtyChange(
                  name,
                  (parseInt(t) || 0) - (data[name]?.quantity || 0)
                )
              }
            />

            <TouchableOpacity
              onPress={() => onQtyChange(name, 1)}
              style={{
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 6,
                backgroundColor: "#F3F4F6",
              }}
            >
              <Plus size={16} />
            </TouchableOpacity>
          </View>
        )}

        {/* WEIGHT */}
        {config[name]?.hasWeight && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: config[name]?.hasQuantity ? 10 : 0,
            }}
          >
            <TextInput
              style={{
                width: 60,
                height: 36,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                textAlign: "center",
                borderRadius: 6,
              }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              value={data[name]?.weight}
              onChangeText={(t) => onWeightChange(name, t)}
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 13,
                color: COLORS.textSecondary,
              }}
            >
              kg
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}