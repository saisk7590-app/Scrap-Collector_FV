import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import OptionItem from "../../components/OptionItem";
import {
  Bell,
  ShieldCheck,
  Globe,
  Info,
  Trash2,
  Lock,
  Headphones,
  CreditCard,
  FileText,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { getStoredUser } from "../../src/lib/api";

export default function SettingsScreen({ navigation }) {
  const { userRole } = useAuth();
  const [role, setRole] = useState(userRole || "customer");
  const [pushJobs, setPushJobs] = useState(true);
  const [pushPayouts, setPushPayouts] = useState(true);
  const [productNews, setProductNews] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [showPolicies, setShowPolicies] = useState(false);

  useEffect(() => {
    // fallback to stored role if context isn't set yet
    const load = async () => {
      if (userRole) return;
      const stored = await getStoredUser();
      if (stored?.role) setRole(stored.role);
    };
    load();
  }, [userRole]);

  const goToComingSoon = (title) => navigation.navigate("ComingSoon", { title });

  const ToggleRow = ({ label, description, value, onValueChange }) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.sub}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#fff"
        trackColor={{ false: "#E5E7EB", true: "#22C55E" }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header variant="default" title="Settings" showBack />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {role === "collector" ? (
            <>
              <ToggleRow
                label="Job assignments"
                description="New pickups, schedule changes"
                value={pushJobs}
                onValueChange={setPushJobs}
              />
              <ToggleRow
                label="Payout updates"
                description="Credits, rejections, deductions"
                value={pushPayouts}
                onValueChange={setPushPayouts}
              />
              <ToggleRow
                label="Product updates"
                description="New features and beta programs"
                value={productNews}
                onValueChange={setProductNews}
              />
            </>
          ) : (
            <>
              <ToggleRow
                label="Order updates"
                description="Pickup confirmations, ETA changes"
                value={pushJobs}
                onValueChange={setPushJobs}
              />
              <ToggleRow
                label="Wallet & cashback"
                description="Refunds, credits, promotions"
                value={pushPayouts}
                onValueChange={setPushPayouts}
              />
              <ToggleRow
                label="Announcements"
                description="Feature launches and offers"
                value={productNews}
                onValueChange={setProductNews}
              />
            </>
          )}
        </View>

        {/* Account & Security */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          {role === "collector" && (
            <OptionItem
              title="KYC & Documents"
              icon={<ShieldCheck />}
              onPress={() => goToComingSoon("KYC & Documents")}
            />
          )}
          <OptionItem
            title="Change Password"
            icon={<Lock />}
            onPress={() => goToComingSoon("Change Password")}
          />
          <View style={{ marginTop: 4 }}>
            <ToggleRow
              label="Biometric sign-in"
              description="Unlock app with device biometrics"
              value={biometric}
              onValueChange={setBiometric}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <OptionItem
            title="Language"
            icon={<Globe />}
            onPress={() => goToComingSoon("Language")}
          />
          {role === "collector" && (
            <OptionItem
              title="Payout method"
              icon={<CreditCard />}
              onPress={() => goToComingSoon("Payout method")}
            />
          )}
        </View>

        {/* Policies & App info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Policies & App</Text>
          <OptionItem
            title="Policies"
            icon={<FileText />}
            expandable
            expanded={showPolicies}
            onPress={() => setShowPolicies(!showPolicies)}
          >
            <OptionItem
              title="Privacy Policy"
              icon={<Bell />}
              onPress={() => goToComingSoon("Privacy Policy")}
            />
            <OptionItem
              title="Terms & Conditions"
              icon={<Bell />}
              onPress={() => goToComingSoon("Terms & Conditions")}
            />
          </OptionItem>
          <OptionItem
            title="About App"
            icon={<Info />}
            onPress={() => goToComingSoon("About App")}
          />
          <View style={styles.versionRow}>
            <Text style={styles.label}>App version</Text>
            <Text style={styles.version}>1.0.0 (collector)</Text>
          </View>
        </View>

        {/* Support & danger */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          <OptionItem
            title="Contact Support"
            icon={<Headphones />}
            onPress={() => goToComingSoon("Support")}
          />
          <OptionItem
            title="Delete Account"
            icon={<Trash2 />}
            danger
            onPress={() => goToComingSoon("Delete Account")}
          />
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#111827",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: { fontSize: 15, fontWeight: "600", color: "#111827" },
  sub: { color: "#6B7280", marginTop: 2, fontSize: 12 },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  version: { color: "#6B7280", fontWeight: "600" },
});
