import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Recycle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import CustomInput from "../../components/CustomInput";
import { apiRequest } from "../../src/lib/api";
import { useAuth } from "../../context/AuthContext";

export default function CollectorLoginScreen() {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const email = `${mobile}@scrapcollector.in`;

      const data = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      // Check role
      if (data.user.role !== "collector") {
        Alert.alert("Error", "This account is not a collector");
        return;
      }

      // Pass token + user data to context
      await signIn(data.token, data.user);

      // No need to reset navigation manually, App.js will handle it!

    } catch (err) {
      Alert.alert("Login Failed", err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Recycle size={60} color="#2563EB" style={styles.logo} />

        <Text style={styles.title}>Collector Login</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.link}>
          Don't have an account?{" "}
          <Text
            style={styles.linkPrimary}
            onPress={() => navigation.navigate("SignUp")}
          >
            Register
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E7FF", // Light blue background
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

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
  },

  linkPrimary: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
