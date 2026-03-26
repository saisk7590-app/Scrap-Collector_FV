import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Recycle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { COLORS, ROUTES, FONTS } from "../../constants";
import { apiRequest } from "../../src/lib/api";
import { useAuth } from "../../context/AuthContext";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signIn } = useAuth();

  // ===== COMMON STATES =====
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== ROLE BASED STATES =====
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");

  const [communityName, setCommunityName] = useState("");
  const [areaAddress, setAreaAddress] = useState("");

  // ===== ROLES =====
  const ROLES = [
    { label: "Customer", value: "customer" },
    { label: "Collector", value: "collector" },
    { label: "Corporate", value: "corporate" },
    { label: "Government Sector", value: "government" },
    { label: "Gated Community", value: "community" },
  ];

  // ===== SIGNUP HANDLER =====
  const handleSignUp = async () => {
    if (loading) return;

    // Basic validation
    if (!fullName || !mobile || !password || !selectedRole) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (mobile.length < 10) {
      Alert.alert("Error", "Enter valid mobile number");
      return;
    }

    // Role-specific validation
    if (selectedRole === "corporate" && (!companyName || !gstNumber)) {
      Alert.alert("Error", "Please fill corporate details");
      return;
    }

    if (selectedRole === "government" && !departmentName) {
      Alert.alert("Error", "Please fill department details");
      return;
    }

    if (selectedRole === "community" && !communityName) {
      Alert.alert("Error", "Please fill community details");
      return;
    }

    setLoading(true);

    try {
      // ===== BUILD PAYLOAD =====
      const payload = {
        fullName,
        phone: mobile,
        password,
        role: selectedRole,
      };

      if (selectedRole === "corporate") {
        payload.companyName = companyName;
        payload.gstNumber = gstNumber;
        payload.officeAddress = officeAddress;
      }

      if (selectedRole === "government") {
        payload.departmentName = departmentName;
        payload.officeLocation = officeLocation;
      }

      if (selectedRole === "community") {
        payload.communityName = communityName;
        payload.areaAddress = areaAddress;
      }

      const data = await apiRequest("/auth/register", "POST", payload);

      await signIn(data.token, data.user);

      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Recycle size={60} color={COLORS.primary} style={styles.logo} />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join and start recycling today
          </Text>

          {/* ===== ROLE DROPDOWN ===== */}
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedRole}
              onValueChange={(itemValue) => setSelectedRole(itemValue)}
            >
              <Picker.Item label="Select Role" value="" />
              {ROLES.map((role) => (
                <Picker.Item
                  key={role.value}
                  label={role.label}
                  value={role.value}
                />
              ))}
            </Picker>
          </View>

          {/* ===== COMMON FIELDS ===== */}
          <CustomInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />

          <CustomInput
            placeholder="Password"
            secure
            value={password}
            onChangeText={setPassword}
          />

          {/* ===== DYNAMIC FIELDS ===== */}

          {/* Corporate */}
          {selectedRole === "corporate" && (
            <>
              <CustomInput
                placeholder="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
              />
              <CustomInput
                placeholder="GST Number"
                value={gstNumber}
                onChangeText={setGstNumber}
              />
              <CustomInput
                placeholder="Office Address"
                value={officeAddress}
                onChangeText={setOfficeAddress}
              />
            </>
          )}

          {/* Government */}
          {selectedRole === "government" && (
            <>
              <CustomInput
                placeholder="Department Name"
                value={departmentName}
                onChangeText={setDepartmentName}
              />
              <CustomInput
                placeholder="Office Location"
                value={officeLocation}
                onChangeText={setOfficeLocation}
              />
            </>
          )}

          {/* Community */}
          {selectedRole === "community" && (
            <>
              <CustomInput
                placeholder="Community Name"
                value={communityName}
                onChangeText={setCommunityName}
              />
              <CustomInput
                placeholder="Area / Address"
                value={areaAddress}
                onChangeText={setAreaAddress}
              />
            </>
          )}

          {/* ===== BUTTON ===== */}
          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
          />

          {/* ===== FOOTER ===== */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              Login
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCFCE7",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 20,
    fontSize: 15,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.md,
  },
  link: {
    color: COLORS.primary,
    fontSize: FONTS.size.md,
    fontWeight: "bold",
  },
});