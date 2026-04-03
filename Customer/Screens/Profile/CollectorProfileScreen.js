import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LogOut,
  ArrowLeft,
  Settings,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Wallet,
  Truck,
  CreditCard,
  FileText,
  Upload,
  Headphones,
  Star,
  CheckCircle,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { apiRequest, getStoredUser } from "../../src/lib/api";
import { useFocusEffect } from "@react-navigation/native";
import ProfileAvatar from "../../components/ProfileAvatar";

const InfoRow = ({ icon, label, value, highlight }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && { color: "#16A34A" }]}>
        {value || "Not set"}
      </Text>
    </View>
  </View>
);

export default function CollectorProfileScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    fullName: "Collector",
    phone: "",
    address: "",
    walletBalance: 0,
    id: "",
    role: "collector",
    email: "",
    joinedAt: "",
    profileImageUrl: "",
  });
  const [availability, setAvailability] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [totalPickups, setTotalPickups] = useState(0);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/profile");
        if (data.profile) {
          setProfile({
            fullName: data.profile.fullName || "Collector",
            phone: data.profile.phone || "",
            address: data.profile.address || "",
            walletBalance: data.profile.walletBalance || 0,
            id: data.profile.id || "",
            role: data.profile.role || "collector",
            joinedAt: data.profile.createdAt || "",
            email: data.profile.email || "",
            profileImageUrl: data.profile.profileImageUrl || "",
          });
          setImageRefreshKey(Date.now());
        }
      } catch {
        const stored = await getStoredUser();
        if (stored) {
          setProfile((prev) => ({
            ...prev,
            fullName: stored.fullName || prev.fullName,
            phone: stored.phone || prev.phone,
            address: stored.address || prev.address,
            role: stored.role || prev.role,
          }));
        }
      }
    };

    const fetchTotals = async () => {
      try {
        const data = await apiRequest("/pickups/all");
        if (Array.isArray(data.pickups)) {
          setTotalPickups(data.pickups.length);
        }
      } catch (e) {
        console.log("Total pickups fetch failed:", e?.message || e);
      }
    };

    fetchProfile();
    fetchTotals();
  }, []);

  // Refresh data when screen is focused after edits
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const data = await apiRequest("/profile");
          if (data.profile) {
            setProfile((prev) => ({
              ...prev,
              fullName: data.profile.fullName || prev.fullName,
              phone: data.profile.phone || prev.phone,
              address: data.profile.address || prev.address,
              walletBalance: data.profile.walletBalance || prev.walletBalance,
              profileImageUrl: data.profile.profileImageUrl || prev.profileImageUrl,
            }));
            setImageRefreshKey(Date.now());
          }
        } catch {}
      })();
    }, [])
  );
  const profileImageUri = profile.profileImageUrl
    ? `${profile.profileImageUrl}${profile.profileImageUrl.includes("?") ? "&" : "?"}t=${imageRefreshKey}`
    : null;

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) await signOut();
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => await signOut() },
      ]);
    }
  };

  const navigateSoon = (title) => navigation.navigate("ComingSoon", { title });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collector Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Settings color="#111827" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={styles.card}>
          <View style={styles.heroTop}>
            <ProfileAvatar
              uri={profileImageUri}
              name={profile.fullName}
              size={64}
              backgroundColor="#03C75A"
              borderColor="#FFFFFF"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.fullName}</Text>
                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>{profile.role}</Text>
                </View>
              </View>
              <Text style={styles.subtle}>ID #{profile.id || "—"}</Text>
              <Text style={styles.subtle}>Joined {profile.joinedAt ? new Date(profile.joinedAt).toDateString() : "—"}</Text>
            </View>
            <View style={styles.ratingPill}>
              <Star size={16} color="#FACC15" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>On-time rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPickups}</Text>
              <Text style={styles.statLabel}>Total pickups</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹ {profile.walletBalance}</Text>
              <Text style={styles.statLabel}>Wallet</Text>
            </View>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>I’m available for pickups</Text>
              <Text style={styles.subtle}>Customers and dispatch can see you online</Text>
            </View>
            <Switch value={availability} onValueChange={setAvailability} thumbColor="#fff" trackColor={{ false: "#E5E7EB", true: "#16A34A" }} />
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Auto-accept nearby jobs</Text>
              <Text style={styles.subtle}>Accepts jobs within 3 km automatically</Text>
            </View>
            <Switch value={autoAccept} onValueChange={setAutoAccept} thumbColor="#fff" trackColor={{ false: "#E5E7EB", true: "#2563EB" }} />
          </View>
        </View>

        {/* Contact & compliance */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact & Verification</Text>
          <InfoRow icon={<Phone size={16} color="#2563EB" />} label="Primary Phone" value={profile.phone} />
          <InfoRow icon={<Mail size={16} color="#2563EB" />} label="Email" value={profile.email || "add email"} />
          <InfoRow icon={<MapPin size={16} color="#2563EB" />} label="Service Zone" value={profile.address || "not set"} />
          <InfoRow icon={<ShieldCheck size={16} color="#16A34A" />} label="KYC Status" value="Verified • Aadhaar + DL" highlight />
        </View>

        {/* Vehicle & payout */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle & Payout</Text>
          <InfoRow icon={<Truck size={16} color="#2563EB" />} label="Vehicle" value="Tata Ace • KA 05 AB 1234" />
          <InfoRow icon={<Wallet size={16} color="#2563EB" />} label="Preferred Payout" value="UPI • collector@upi" />
          <InfoRow icon={<CreditCard size={16} color="#2563EB" />} label="Bank Account" value="HDFC • **** 4421" />
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.docRow}>
            <View style={styles.docBadgeSuccess}>
              <CheckCircle size={14} color="#16A34A" />
              <Text style={styles.docText}>Driver Licence</Text>
            </View>
            <TouchableOpacity onPress={() => navigateSoon("Driver Licence")}>
              <Text style={styles.link}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.docRow}>
            <View style={styles.docBadgePending}>
              <FileText size={14} color="#F97316" />
              <Text style={styles.docText}>Police Verification</Text>
            </View>
            <TouchableOpacity onPress={() => navigateSoon("Police Verification")}>
              <Text style={styles.link}>Upload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.docRow}>
            <View style={styles.docBadgePending}>
              <Upload size={14} color="#F97316" />
              <Text style={styles.docText}>Vehicle RC</Text>
            </View>
            <TouchableOpacity onPress={() => navigateSoon("Vehicle RC")}>
              <Text style={styles.link}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("EditProfile")}>
            <FileText size={18} color="#2563EB" />
            <Text style={styles.actionLabel}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateSoon("Earnings Summary")}>
            <Wallet size={18} color="#2563EB" />
            <Text style={styles.actionLabel}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateSoon("Support")}>
            <Headphones size={18} color="#2563EB" />
            <Text style={styles.actionLabel}>Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#FFFFFF" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  container: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#111827",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 20, fontWeight: "700", color: "#111827" },
  rolePill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleText: { color: "#4F46E5", fontWeight: "700", fontSize: 12 },
  subtle: { color: "#6B7280", marginTop: 2, fontSize: 13 },
  ratingPill: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: { fontWeight: "700", color: "#92400E" },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  statDivider: { width: 1, height: 32, backgroundColor: "#E5E7EB" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#111827" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#111827" },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  docBadgeSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF3",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  docBadgePending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF7ED",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  docText: { fontWeight: "600", color: "#111827" },
  link: { color: "#2563EB", fontWeight: "700" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#E0F2FE",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    gap: 6,
  },
  actionLabel: { color: "#1D4ED8", fontWeight: "700" },
  logoutButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
