import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Phone, MapPin, Edit, LogOut, Settings, HelpCircle, Wallet } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../../components/Header";
import ProfileMenuItem from "../../components/ProfileMenuItem";
import CustomButton from "../../components/CustomButton";

import { getStoredUser } from "../../src/lib/api";
import { COLORS, SPACING, ROUTES } from "../../constants";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { signOut } = useAuth();
  const [user, setUser] = React.useState({ name: "Loading...", mobile: "..." });

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await getStoredUser();
      if (stored) {
        setUser({
          name: stored.fullName || stored.name || "Customer",
          mobile: stored.phone || stored.mobile || "",
        });
      }
    } catch (err) {
      console.log("Error loading user data", err);
    }
  };

  const logout = async () => {
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        await signOut();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout", style: "destructive", onPress: async () => {
            await signOut();
            // No need to manually replace navigation, App.js will handle it based on AuthContext state
          }
        }
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* HEADER OUTSIDE SCROLLVIEW */}
      <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
        <Header variant="main" title="Profile" showBack />
      </SafeAreaView>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.md }}>
        {/* PROFILE CARD */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatar}><User color={COLORS.white} size={30} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.row}>
                <Phone size={14} color={COLORS.textSecondary} />
                <Text style={styles.phone}>{user.mobile}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
              <Edit size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem title="Manage Addresses" icon={<MapPin size={18} color={COLORS.primary} />} onPress={() => navigation.navigate("ManageAddresses")} />
            <ProfileMenuItem title="Settings" icon={<Settings size={18} color={COLORS.primary} />} onPress={() => navigation.navigate("Settings")} />
            <ProfileMenuItem title="Help & Support" icon={<HelpCircle size={18} color={COLORS.primary} />} onPress={() => navigation.navigate("Help")} />
            <ProfileMenuItem title="Wallet" icon={<Wallet size={18} color={COLORS.primary} />} onPress={() => navigation.navigate("Wallet")} />
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={{ margin: SPACING.md }}>
          <CustomButton title="Logout" onPress={logout} variant="danger" icon={<LogOut size={18} color={COLORS.white} />} />
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
          Scrap Collector v1.0.0{"\n"}Making the world cleaner 🌱
        </Text>
      </ScrollView>
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, margin: SPACING.md, padding: SPACING.md, borderRadius: 12 },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: COLORS.textPrimary },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  phone: { marginLeft: 6, color: COLORS.textSecondary },
  sectionBlock: { marginHorizontal: SPACING.md, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.textPrimary },
  menuCard: { backgroundColor: COLORS.card, borderRadius: 12, marginTop: 10 },
  footer: { textAlign: "center", color: COLORS.textMuted, marginVertical: 20 },
});
