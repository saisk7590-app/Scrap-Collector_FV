import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  CreditCard,
  FileText,
  Globe,
  Headphones,
  Info,
  Lock,
  MoonStar,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
} from "lucide-react-native";

import Header from "../../components/Header";
import OptionItem from "../../components/OptionItem";
import { getStoredUser } from "../../src/lib/api";
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";

const BRAND_GREEN = "#03C75A";

function ThemeChoice({ colors, label, description, selected, onPress, icon }) {
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.themeChoice} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.themeChoiceLeft}>
        <View style={styles.themeChoiceIcon}>{icon}</View>
        <View>
          <Text style={styles.themeChoiceLabel}>{label}</Text>
          <Text style={styles.themeChoiceText}>{description}</Text>
        </View>
      </View>
      <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { userRole } = useAuth();
  const { colors, themePreference, setTheme } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [role, setRole] = useState(userRole || "customer");
  const [pushJobs, setPushJobs] = useState(true);
  const [pushPayouts, setPushPayouts] = useState(true);
  const [productNews, setProductNews] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [showPolicies, setShowPolicies] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (userRole) return;
      const stored = await getStoredUser();
      if (stored?.role) setRole(stored.role);
    };
    load();
  }, [userRole]);

  const goToComingSoon = (title) => navigation.navigate("ComingSoon", { title });

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and may remove your account data. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => goToComingSoon("Delete Account"),
        },
      ]
    );
  };

  const ToggleRow = ({ label, description, value, onValueChange }) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.sub}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: colors.border, true: BRAND_GREEN }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {role === "collector" ? (
            <>
              <ToggleRow
                label="Job assignments"
                description="New pickups and schedule changes"
                value={pushJobs}
                onValueChange={setPushJobs}
              />
              <ToggleRow
                label="Payout updates"
                description="Credits, deductions, and payout status"
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
                label="Pickup updates"
                description="Booking confirmations and ETA changes"
                value={pushJobs}
                onValueChange={setPushJobs}
              />
              <ToggleRow
                label="Wallet & cashback"
                description="Refunds, credits, and offers"
                value={pushPayouts}
                onValueChange={setPushPayouts}
              />
              <ToggleRow
                label="Announcements"
                description="Feature launches and service updates"
                value={productNews}
                onValueChange={setProductNews}
              />
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          {role === "collector" ? (
            <OptionItem
              title="KYC & Documents"
              icon={<ShieldCheck />}
              iconColor={colors.icon}
              onPress={() => goToComingSoon("KYC & Documents")}
            />
          ) : null}
          <OptionItem
            title="Change Password"
            icon={<Lock />}
            iconColor={colors.icon}
            onPress={() => goToComingSoon("Change Password")}
          />
          <ToggleRow
            label="Biometric sign-in"
            description="Unlock the app with your device biometrics"
            value={biometric}
            onValueChange={setBiometric}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferenceBlock}>
            <Text style={styles.preferenceTitle}>Theme</Text>
            <Text style={styles.preferenceText}>Choose light, dark, or follow your device setting.</Text>
          </View>
          <ThemeChoice
            colors={colors}
            label="Light"
            description="Bright surfaces for daylight use"
            selected={themePreference === "light"}
            onPress={() => setTheme("light")}
            icon={<Sun size={18} color={colors.icon} />}
          />
          <ThemeChoice
            colors={colors}
            label="Dark"
            description="Dimmed surfaces for low-light use"
            selected={themePreference === "dark"}
            onPress={() => setTheme("dark")}
            icon={<MoonStar size={18} color={colors.icon} />}
          />
          <ThemeChoice
            colors={colors}
            label="System Default"
            description="Automatically match your device theme"
            selected={themePreference === "system"}
            onPress={() => setTheme("system")}
            icon={<Smartphone size={18} color={colors.icon} />}
          />
          <View style={styles.spacer} />
          <OptionItem
            title="Language"
            icon={<Globe />}
            iconColor={colors.icon}
            onPress={() => goToComingSoon("Language")}
          />
          {role === "collector" ? (
            <OptionItem
              title="Payout method"
              icon={<CreditCard />}
              iconColor={colors.icon}
              onPress={() => goToComingSoon("Payout method")}
            />
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Policies & App</Text>
          <OptionItem
            title="Policies"
            icon={<FileText />}
            iconColor={colors.icon}
            expandable
            expanded={showPolicies}
            onPress={() => setShowPolicies((prev) => !prev)}
          >
            <OptionItem
              title="Privacy Policy"
              icon={<Bell />}
              iconColor={colors.icon}
              onPress={() => goToComingSoon("Privacy Policy")}
            />
            <OptionItem
              title="Terms & Conditions"
              icon={<Bell />}
              iconColor={colors.icon}
              onPress={() => goToComingSoon("Terms & Conditions")}
            />
          </OptionItem>
          <OptionItem
            title="About App"
            icon={<Info />}
            iconColor={colors.icon}
            onPress={() => goToComingSoon("About App")}
          />
          <View style={styles.versionRow}>
            <Text style={styles.label}>App version</Text>
            <Text style={styles.version}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          <OptionItem
            title="Contact Support"
            icon={<Headphones />}
            iconColor={colors.icon}
            onPress={() => goToComingSoon("Support")}
          />
          <OptionItem
            title="Delete Account"
            icon={<Trash2 />}
            iconColor={colors.danger}
            danger
            onPress={confirmDeleteAccount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 22,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: colors.mode === "dark" ? 0.14 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    toggleCopy: {
      flex: 1,
      paddingRight: 12,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    sub: {
      color: colors.textMuted,
      marginTop: 3,
      fontSize: 12,
      lineHeight: 18,
    },
    preferenceBlock: {
      marginBottom: 10,
    },
    preferenceTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    preferenceText: {
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 18,
    },
    themeChoice: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 13,
      marginTop: 10,
      backgroundColor: colors.background,
    },
    themeChoiceLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      paddingRight: 12,
    },
    themeChoiceIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    themeChoiceLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    themeChoiceText: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    radioOuterActive: {
      borderColor: BRAND_GREEN,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: BRAND_GREEN,
    },
    spacer: {
      height: 14,
    },
    versionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 6,
    },
    version: {
      color: colors.textMuted,
      fontWeight: "600",
    },
  });
