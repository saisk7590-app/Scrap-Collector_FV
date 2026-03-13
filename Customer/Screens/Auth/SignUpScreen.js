import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Recycle, Truck, ShoppingBag } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { COLORS, ROUTES, FONTS, SIZES } from "../../constants";
import { apiRequest } from "../../src/lib/api";
import { useAuth } from "../../context/AuthContext";

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer"); // 'customer' or 'collector'

  const { signIn } = useAuth();

  const handleSignUp = async () => {
    if (loading) return;

    if (!fullName || !mobile || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mobile.length < 10) {
      Alert.alert("Error", "Enter valid mobile number");
      return;
    }

    setLoading(true);

    try {
      const email = `${mobile}@scrapcollector.in`;

      const data = await apiRequest("/auth/register", "POST", {
        email,
        password,
        fullName,
        phone: mobile,
        role: selectedRole,
      });

      // Pass token + user data to context
      await signIn(data.token, data.user);

      Alert.alert("Success", "Account created successfully!");

      // No need to navigate manually, App.js will rerender!

    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        selectedRole === "collector" && styles.safeAreaCollector,
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Recycle
            size={60}
            color={selectedRole === "collector" ? COLORS.info : COLORS.primary}
            style={styles.logo}
          />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join and start recycling today</Text>

          {/* ===== ROLE TOGGLE ===== */}
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === "customer" && styles.roleOptionActive,
              ]}
              onPress={() => setSelectedRole("customer")}
            >
              <ShoppingBag
                size={20}
                color={selectedRole === "customer" ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "customer" && styles.roleTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === "collector" && styles.roleOptionActiveBlue,
              ]}
              onPress={() => setSelectedRole("collector")}
            >
              <Truck
                size={20}
                color={selectedRole === "collector" ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "collector" && styles.roleTextActive,
                ]}
              >
                Collector
              </Text>
            </TouchableOpacity>
          </View>

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

          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            variant={selectedRole === "collector" ? "info" : "primary"}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>
            <Text
              style={[
                styles.link,
                selectedRole === "collector" && styles.linkCollector,
              ]}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCFCE7", // Light green
  },
  safeAreaCollector: {
    backgroundColor: "#EFF6FF", // Light blue
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

  // ===== ROLE TOGGLE =====
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  roleToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },

  roleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },

  roleOptionActiveBlue: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },

  roleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  roleTextActive: {
    color: "#FFFFFF",
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
    color: COLORS.primary, // Green primary
    fontSize: FONTS.size.md,
    fontWeight: "bold",
  },
  linkCollector: {
    color: COLORS.info, // Blue info
  },
});
