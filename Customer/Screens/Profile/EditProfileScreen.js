import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Phone, MapPin } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../../components/Header";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../src/lib/api";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/profile");
      if (data.profile) {
        setName(data.profile.fullName || "");
        setMobile(data.profile.phone || "");
        setAddress(data.profile.address || "");
      }
    } catch (err) {
      console.log("Fetch Profile Error:", err);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your full name");
      return;
    }
    
    setSaving(true);
    try {
      const res = await apiRequest("/profile", "PUT", {
        fullName: name,
        phone: mobile,
        address: address,
      });
      // persist updated user locally so other screens show latest immediately
      if (res.profile) {
        await AsyncStorage.setItem("userData", JSON.stringify(res.profile));
      }
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
      navigation.goBack();
    } catch (err) {
      console.log("Update Profile Error:", err);
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="default"
        title="Edit Profile"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <User size={18} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Phone size={18} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={[styles.inputGroup, { borderBottomWidth: 0 }]}>
            <MapPin size={18} color={COLORS.primary} />
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              placeholder="Primary Address (Home/Office)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.editScreenBg || "#F9FAFB",
  },

  container: {
    padding: 16,
  },

  card: {
    backgroundColor: COLORS.editCardBg || "#FFF",
    borderRadius: 16,
    padding: 16,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.editDivider || "#E5E7EB",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.editTextMain || "#111827",
  },

  saveBtn: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
