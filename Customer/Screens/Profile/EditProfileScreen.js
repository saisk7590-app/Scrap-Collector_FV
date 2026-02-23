import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Phone } from "lucide-react-native";

import Header from "../../components/Header"; // use Header component
import { COLORS } from "../../constants/colors";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("Sai Kiran");
  const [mobile, setMobile] = useState("9876543210");

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <Header
        variant="default"      // light/white header
        title="Edit Profile"
        showBack={true}        // show back button
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <User size={18} color={COLORS.editPrimary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.editTextSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Phone size={18} color={COLORS.editPrimary} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor={COLORS.editTextSecondary}
              keyboardType="number-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.editScreenBg,
  },

  container: {
    padding: 16,
  },

  card: {
    backgroundColor: COLORS.editCardBg,
    borderRadius: 16,
    padding: 16,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.editDivider,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.editTextMain,
  },

  saveBtn: {
    marginTop: 30,
    backgroundColor: COLORS.editPrimary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
