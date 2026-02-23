import React, { useState, useCallback } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Recycle, FileText, Cpu, Coins, GlassWater } from "lucide-react-native";

import Header from "../../components/Header";
import WalletInfoCard from "../../components/WalletInfoCard";
import CategoryCard from "../../components/CategoryCard";
import CustomButton from "../../components/CustomButton";

import { COLORS, SPACING, ROUTES } from "../../constants";
import { apiRequest } from "../../src/lib/api";

const CATEGORY_DATA = [
  { name: "Plastic", icon: Recycle, iconBg: "#3B82F6", bg: "#EFF6FF" },
  { name: "E-Waste", icon: Cpu, iconBg: "#EAB308", bg: "#FEFCE8" },
  { name: "Paper", icon: FileText, iconBg: "#9CA3AF", bg: "#F9FAFB" },
  { name: "Metal", icon: Coins, iconBg: "#94A3B8", bg: "#F8FAFC" },
  { name: "Glass", icon: GlassWater, iconBg: "#0EA5E9", bg: "#F0F9FF" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [totalScrap, setTotalScrap] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [profileData, pickupsData] = await Promise.all([
        apiRequest("/profile"),
        apiRequest("/pickups/my"),
      ]);

      if (profileData.profile) {
        setProfile({
          full_name: profileData.profile.fullName,
          wallet_balance: profileData.profile.walletBalance,
        });
      }

      if (pickupsData.pickups) {
        const completed = pickupsData.pickups.filter(p => p.status === 'completed');
        const scrap = completed.reduce((sum, p) => sum + Number(p.total_qty || 0), 0);
        setTotalScrap(scrap);
      }
    } catch (err) {
      console.log("Home fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* ✅ FIXED HERE */}
        <Header
          variant="home"
          userName={profile?.full_name}
          onNotificationPress={() =>
            navigation.navigate(ROUTES.NOTIFICATIONS)
          }
        />

        <WalletInfoCard
          balance={profile?.wallet_balance ?? 0}
          totalScrap={totalScrap}
          onPress={() => navigation.navigate(ROUTES.HISTORY)}
          variant="home"
          style={{ marginHorizontal: SPACING.md, marginTop: -28 }}
        />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: SPACING.md,
            marginTop: SPACING.lg,
          }}
        >
          {CATEGORY_DATA.map((item) => (
            <CategoryCard
              key={item.name}
              title={item.name}
              icon={item.icon}
              iconBg={item.iconBg}
              cardBg={item.bg}
              onPress={() =>
                navigation.navigate(ROUTES.SELL_SCRAP, {
                  category: item.name,
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: SPACING.md,
          borderTopWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
        <CustomButton
          title="Request Pickup"
          onPress={() => navigation.navigate(ROUTES.SELL_SCRAP)}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}
