import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Building,
  Edit,
  HelpCircle,
  Home,
  Layout,
  LogOut,
  Mail,
  Map,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react-native";

import Header from "../../components/Header";
import ProfileAvatar from "../../components/ProfileAvatar";
import ProfileMenuItem from "../../components/ProfileMenuItem";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";
import { apiRequest } from "../../src/lib/api";

function DetailRow({ colors, icon, label, value, isLast }) {
  const styles = getStyles(colors);

  return (
    <View style={[styles.detailRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "Not set"}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { signOut } = useAuth();
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/profile");
      setProfileData(data.profile);
      setImageRefreshKey(Date.now());
      setLoadError("");
    } catch (err) {
      setLoadError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const role = profileData?.role?.toLowerCase() || "";
  const isCorporate = role === "corporate";
  const isGovernment = role === "govt_sector";
  const isCommunity = role === "gated_community";
  const profileImageUri = profileData?.profileImageUrl
    ? `${profileData.profileImageUrl}${profileData.profileImageUrl.includes("?") ? "&" : "?"}t=${imageRefreshKey}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Profile" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.profileCard}>
          {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}
          <View style={styles.avatarContainer}>
            <ProfileAvatar
              uri={profileImageUri}
              name={profileData?.fullName}
              size={92}
              backgroundColor={colors.primary}
              borderColor={colors.surface}
            />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            >
              <Edit size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{profileData?.fullName || "Welcome User"}</Text>
          <View style={styles.roleBadge}>
            <ShieldCheck size={12} color={colors.primary} />
            <Text style={styles.roleText}>{profileData?.role || "User"}</Text>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.infoRow}>
              <Phone size={14} color={colors.icon} />
              <Text style={styles.infoText}>{profileData?.phone || "No phone number added"}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={14} color={colors.icon} />
              <Text style={styles.infoText} numberOfLines={2}>
                {profileData?.address || "Address not available"}
              </Text>
            </View>
          </View>
        </View>

        {(isCorporate || isGovernment || isCommunity) ? (
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Role Details</Text>

            {isCorporate ? (
              <>
                <DetailRow colors={colors} icon={<Building size={18} color={colors.primary} />} label="Company" value={profileData?.companyName} />
                <DetailRow colors={colors} icon={<User size={18} color={colors.primary} />} label="Contact Person" value={profileData?.contactPerson} />
                <DetailRow colors={colors} icon={<Phone size={18} color={colors.primary} />} label="Contact Number" value={profileData?.contactPhone} />
                <DetailRow colors={colors} icon={<Mail size={18} color={colors.primary} />} label="Corporate Email" value={profileData?.companyEmail} />
                <DetailRow colors={colors} icon={<ShieldCheck size={18} color={colors.primary} />} label="GST Number" value={profileData?.gstNumber} />
                <DetailRow colors={colors} icon={<MapPin size={18} color={colors.primary} />} label="Address" value={profileData?.officeAddress} isLast />
              </>
            ) : null}

            {isGovernment ? (
              <>
                <DetailRow colors={colors} icon={<Building size={18} color={colors.primary} />} label="Department" value={profileData?.departmentName} />
                <DetailRow colors={colors} icon={<User size={18} color={colors.primary} />} label="Officer Name" value={profileData?.officerName} />
                <DetailRow colors={colors} icon={<Phone size={18} color={colors.primary} />} label="Contact Number" value={profileData?.contactNumber} />
                <DetailRow colors={colors} icon={<Map size={18} color={colors.primary} />} label="Zone" value={profileData?.zone} />
                <DetailRow colors={colors} icon={<MapPin size={18} color={colors.primary} />} label="Address" value={profileData?.officeLocation} isLast />
              </>
            ) : null}

            {isCommunity ? (
              <>
                <DetailRow colors={colors} icon={<Home size={18} color={colors.primary} />} label="Community" value={profileData?.communityName} />
                <DetailRow colors={colors} icon={<User size={18} color={colors.primary} />} label="Manager Name" value={profileData?.managerName} />
                <DetailRow colors={colors} icon={<Phone size={18} color={colors.primary} />} label="Manager Phone" value={profileData?.managerPhone} />
                <DetailRow colors={colors} icon={<Layout size={18} color={colors.primary} />} label="Total Units" value={profileData?.totalUnits} />
                <DetailRow colors={colors} icon={<MapPin size={18} color={colors.primary} />} label="Address" value={profileData?.areaAddress} isLast />
              </>
            ) : null}
          </View>
        ) : null}

        <TouchableOpacity style={styles.walletCard} onPress={() => navigation.navigate(ROUTES.WALLET)}>
          <View style={styles.walletLeft}>
            <View style={styles.walletIcon}>
              <Wallet size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹{profileData?.walletBalance || "0.00"}</Text>
            </View>
          </View>
          <View style={styles.topUpBtn}>
            <Text style={styles.topUpText}>View</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon={<MapPin size={22} color={colors.icon} />}
            title="Manage Addresses"
            onPress={() => navigation.navigate(ROUTES.MANAGE_ADDRESSES)}
          />
          <ProfileMenuItem
            icon={<Settings size={22} color={colors.icon} />}
            title="Account Settings"
            onPress={() => navigation.navigate(ROUTES.SETTINGS)}
          />
          <ProfileMenuItem
            icon={<HelpCircle size={22} color={colors.icon} />}
            title="Help & Support"
            onPress={() => navigation.navigate(ROUTES.HELP)}
          />
          <ProfileMenuItem
            icon={<LogOut size={22} color={colors.danger} />}
            title="Logout"
            onPress={handleLogout}
            textColor={colors.danger}
            showArrow={false}
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: colors.mode === "dark" ? 0.18 : 0.06,
      shadowRadius: 15,
      elevation: 3,
      marginBottom: 20,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 16,
    },
    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.surface,
    },
    userName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    roleBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginBottom: 20,
      gap: 6,
    },
    roleText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
      textTransform: "uppercase",
    },
    contactInfo: {
      width: "100%",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      gap: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    infoText: {
      fontSize: 14,
      color: colors.textMuted,
      flex: 1,
    },
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textMuted,
      marginBottom: 16,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 16,
    },
    detailIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.surfaceAlt,
      justifyContent: "center",
      alignItems: "center",
    },
    detailTextWrap: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    walletCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primarySoft,
      padding: 16,
      borderRadius: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    walletLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    walletIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    walletLabel: {
      fontSize: 12,
      color: colors.textMuted,
    },
    walletAmount: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    topUpBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    topUpText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
    },
    menuContainer: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    version: {
      textAlign: "center",
      color: colors.textSoft,
      fontSize: 12,
      marginTop: 24,
    },
    errorText: {
      width: "100%",
      color: colors.danger,
      fontSize: 13,
      marginBottom: 12,
      textAlign: "center",
    },
  });
