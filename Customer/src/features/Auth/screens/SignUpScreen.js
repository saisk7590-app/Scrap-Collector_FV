import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Recycle, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Shield, 
  MapPin, 
  Map, 
  Home, 
  Layout,
  Lock
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { COLORS, ROUTES, FONTS } from "@constants";
import { apiRequest } from "@lib/api";
import { useAuth } from "@context/AuthContext";

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
  // Corporate
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  // Government
  const [departmentName, setDepartmentName] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [zone, setZone] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");

  // Gated Community
  const [communityName, setCommunityName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [areaAddress, setAreaAddress] = useState("");

  // ===== ROLES =====
  const ROLES = [
    { label: "Customer", value: "customer" },
    { label: "Collector", value: "collector" },
    { label: "Corporate", value: "corporate" },
    { label: "Government Sector", value: "govt_sector" },
    { label: "Gated Community", value: "gated_community" },
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
    if (selectedRole === "corporate" && !companyName) {
      Alert.alert("Error", "Please fill company name");
      return;
    }

    if (selectedRole === "govt_sector" && !departmentName) {
      Alert.alert("Error", "Please fill department details");
      return;
    }

    if (selectedRole === "gated_community" && !communityName) {
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
        // Role specifics
        companyName,
        contactPerson,
        contactPhone,
        companyEmail,
        gstNumber,
        officeAddress,
        departmentName,
        officerName,
        contactNumber,
        zone,
        officeLocation,
        communityName,
        managerName,
        managerPhone,
        totalUnits,
        areaAddress,
      };

      const data = await apiRequest("/auth/register", "POST", payload);

      await signIn(data.token, data.user);

      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (selectedRole === "corporate") {
      return (
        <View style={styles.roleFields}>
          <Text style={styles.roleSubTitle}>Corporate Details</Text>
          <CustomInput
            placeholder="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
          />
          <CustomInput
            placeholder="Contact Person Name"
            value={contactPerson}
            onChangeText={setContactPerson}
          />
          <CustomInput
            placeholder="Contact Phone"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
          <CustomInput
            placeholder="Company Email"
            value={companyEmail}
            onChangeText={setCompanyEmail}
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="GST Number (Optional)"
            value={gstNumber}
            onChangeText={setGstNumber}
          />
          <CustomInput
            placeholder="Company Office Address"
            value={officeAddress}
            onChangeText={setOfficeAddress}
          />
        </View>
      );
    }
    
    if (selectedRole === "govt_sector") {
      return (
        <View style={styles.roleFields}>
          <Text style={styles.roleSubTitle}>Department Details</Text>
          <CustomInput
            placeholder="Department Name"
            value={departmentName}
            onChangeText={setDepartmentName}
          />
          <CustomInput
            placeholder="Officer Name"
            value={officerName}
            onChangeText={setOfficerName}
          />
          <CustomInput
            placeholder="Contact Member Phone"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
          <CustomInput
            placeholder="Zone (e.g. Zone 1)"
            value={zone}
            onChangeText={setZone}
          />
          <CustomInput
            placeholder="Office Location Address"
            value={officeLocation}
            onChangeText={setOfficeLocation}
          />
        </View>
      );
    }
    
    if (selectedRole === "gated_community") {
      return (
        <View style={styles.roleFields}>
          <Text style={styles.roleSubTitle}>Community Details</Text>
          <CustomInput
            placeholder="Community Name"
            value={communityName}
            onChangeText={setCommunityName}
          />
          <CustomInput
            placeholder="Manager Name"
            value={managerName}
            onChangeText={setManagerName}
          />
          <CustomInput
            placeholder="Manager Phone"
            value={managerPhone}
            onChangeText={setManagerPhone}
            keyboardType="phone-pad"
          />
          <CustomInput
            placeholder="Total Units/Houses"
            value={totalUnits}
            onChangeText={setTotalUnits}
            keyboardType="number-pad"
          />
          <CustomInput
            placeholder="Area/Location Address"
            value={areaAddress}
            onChangeText={setAreaAddress}
          />
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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

            {renderRoleSpecificFields()}

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
        </ScrollView>
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
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
  roleFields: {
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  roleSubTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary || "#2563EB",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});