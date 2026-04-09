import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { COLORS } from "@constants/colors";
import { getItemImage } from "@utils/assetHelpers";

export default function ScrapItemRow({
  item,
  config,
  data,
  onQtyChange,
  onWeightChange,
  onToggle,
}) {
  const name = item.name;
  const state = data[name] || {};

  // ✅ FINAL derived checkbox
  const isSelected =
    (state.quantity || 0) > 0 ||
    (parseFloat(state.weight) || 0) > 0;

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: COLORS.border,
    }}>

      {/* LEFT */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>

        {/* CHECKBOX */}
        <TouchableOpacity
          onPress={() => onToggle(name)}
          style={{
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: COLORS.textSecondary,
            marginRight: 8,
            backgroundColor: isSelected ? COLORS.primary : "transparent",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isSelected && <Text style={{ color: "#fff" }}>✓</Text>}
        </TouchableOpacity>

        <Image
          source={getItemImage(item.image, item.category_name)}
          style={{ width: 40, height: 40, borderRadius: 8, marginRight: 8 }}
        />

        <View>
          <Text style={{ fontWeight: "500" }}>{name}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
            ₹{config[name]?.price || 0} /{" "}
            {config[name]?.type === "weight" ? "kg" : "unit"}
          </Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>

        {config[name]?.hasQuantity && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => onQtyChange(name, -1)} style={styles.btn}>
              <Minus size={16} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(state.quantity || 0)}
              onChangeText={(t) =>
                onQtyChange(name, (parseInt(t) || 0) - (state.quantity || 0))
              }
            />

            <TouchableOpacity onPress={() => onQtyChange(name, 1)} style={styles.btn}>
              <Plus size={16} />
            </TouchableOpacity>
          </View>
        )}

        {config[name]?.hasWeight && (
          <View style={{ flexDirection: "row", marginLeft: 10 }}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={state.weight || ""}
              placeholder="0.00"
              onChangeText={(t) => onWeightChange(name, t)}
            />
            <Text style={{ marginLeft: 4 }}>kg</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = {
  btn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  input: {
    width: 40,
    height: 36,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    textAlign: "center",
    marginHorizontal: 4,
    borderRadius: 6,
  },
};