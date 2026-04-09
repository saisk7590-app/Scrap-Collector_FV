import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Check } from "lucide-react-native";
import Header from "@components/Header";
import CustomButton from "@components/CustomButton";
import { apiRequest } from "@lib/api";

export default function AddAddressScreen({ navigation }) {
  const [type, setType] = useState("Home"); 
  const [houseNo, setHouseNo] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter building/street details");
      return;
    }
    if (!area.trim() || !pincode.trim()) {
      Alert.alert("Error", "Area and Pincode are required");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/addresses", "POST", {
        type,
        house_no: houseNo,
        area,
        pincode,
        landmark,
        address,
        is_default: isDefault,
      });
      Alert.alert("Success", "Address added successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const types = ["Home", "Office", "Other"];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add New Address" showBack />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Address Type</Text>
        <View style={styles.typeContainer}>
          {types.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeOption, type === t && styles.typeSelected]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextSelected]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>House No / Flat No</Text>
        <TextInput
          style={styles.inputSingle}
          placeholder="e.g. Flat 101, Plot 42"
          value={houseNo}
          onChangeText={setHouseNo}
        />

        <Text style={styles.label}>Building / Street / Landmark</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter building name, street, or nearby landmark"
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.inputSingle}
              placeholder="e.g. Madhapur"
              value={area}
              onChangeText={setArea}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.inputSingle}
              placeholder="6 digits"
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
            {isDefault && <Check size={14} color="#FFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton 
          title="Save Address" 
          onPress={handleSave} 
          loading={loading}
          variant="info"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 12 },
  typeContainer: { flexDirection: "row", gap: 10, marginBottom: 24 },
  typeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  typeSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  typeText: { fontSize: 14, color: "#6B7280" },
  typeTextSelected: { color: "#FFF", fontWeight: "600" },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  inputSingle: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    marginBottom: 16,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkboxLabel: { fontSize: 14, color: "#4B5563" },
  footer: { padding: 20, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#E5E7EB" },
});
