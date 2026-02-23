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

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { apiRequest } from "../../src/lib/api";
import { useAuth } from "../../context/AuthContext";

export default function CollectorSignUpScreen() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSignUp = async () => {
    if (!fullName || !mobile || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mobile.length < 10) {
      Alert.alert("Error", "Enter a valid mobile number");
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
        role: "collector",
      });

      // Pass token + user data to context
      await signIn(data.token, data.user);

      // No need to reset navigation manually, App.js will handle it!

    } catch (err) {
      Alert.alert("Error", err.message || "Signup failed");
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
          <Recycle size={60} color="#2563EB" style={styles.logo} />

          <Text style={styles.title}>Collector Sign Up</Text>
          <Text style={styles.subtitle}>Create your collector account</Text>

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
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
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
    backgroundColor: "#E0E7FF", // light blue background
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
    marginBottom: 25,
    fontSize: 15,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  link: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
});
