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
import { Check, Trash2 } from "lucide-react-native";
import Header from "@components/Header";
import CustomButton from "@components/CustomButton";
import { apiRequest } from "@lib/api";

export default function EditAddressScreen({ navigation, route }) {
  const { addressItem } = route.params;

  const [type, setType] = useState(addressItem.type || "Home");
  const [houseNo, setHouseNo] = useState(addressItem.house_no || "");
  const [area, setArea] = useState(addressItem.area || "");
  const [pincode, setPincode] = useState(addressItem.pincode || "");
  const [landmark, setLandmark] = useState(addressItem.landmark || "");
  const [address, setAddress] = useState(addressItem.address || "");
  const [isDefault, setIsDefault] = useState(addressItem.is_default || false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
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
      await apiRequest(`/addresses/${addressItem.id}`, "PUT", {
        type,
        house_no: houseNo,
        area,
        pincode,
        landmark,
        address,
        is_default: isDefault,
      });
      Alert.alert("Success", "Address updated successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await apiRequest(`/addresses/${addressItem.id}`, "DELETE");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete address");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const types = ["Home", "Office", "Other"];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Edit Address" 
        showBack 
        rightIcon={deleting ? <ActivityIndicator size="small" /> : <Trash2 size={20} color="#EF4444" />}
        onRightPress={handleDelete}
      />
      
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

        <View style={{ flexDirection: "row", gap: 15 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.inputSingle}
              placeholder="e.g. Madhapur"
              value={area}
              onChangeText={setArea}
            />
          </View>
          <View style={{ flex: 1 }}>
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
          title="Update Address" 
          onPress={handleUpdate} 
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
