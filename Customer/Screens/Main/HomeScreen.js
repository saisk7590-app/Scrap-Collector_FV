import React, { useState, useCallback } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Header from "../../components/Header";
import WalletInfoCard from "../../components/WalletInfoCard";
import CategoryCard from "../../components/CategoryCard";
import CustomButton from "../../components/CustomButton";

import { COLORS, SPACING, ROUTES } from "../../constants";
import { apiRequest } from "../../src/lib/api";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [totalScrap, setTotalScrap] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [profileData, pickupsData, categoriesData] = await Promise.all([
        apiRequest("/profile").catch(() => null),
        apiRequest("/pickups/my").catch(() => null),
        apiRequest("/data/categories").catch(() => null),
      ]);

      if (profileData?.profile) {
        setProfile({
          full_name: profileData.profile.fullName,
          wallet_balance: profileData.profile.walletBalance,
        });
      }

      if (pickupsData?.pickups) {
        const completed = pickupsData.pickups.filter(
          (p) => p.status === "completed"
        );
        const scrap = completed.reduce(
          (sum, p) => sum + Number(p.total_qty || 0),
          0
        );
        setTotalScrap(scrap);
      }

      if (categoriesData?.categories) {
        setCategories(categoriesData.categories);
      }
    } catch (err) {
      console.log("Home fetch error:", err);
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
        {/* Header */}
        <Header
          variant="home"
          userName={profile?.full_name}
          onNotificationPress={() =>
            navigation.navigate(ROUTES.NOTIFICATIONS)
          }
        />

        {/* Wallet */}
        <WalletInfoCard
          balance={profile?.wallet_balance ?? 0}
          totalScrap={totalScrap}
          onPress={() => navigation.navigate(ROUTES.HISTORY)}
          variant="home"
          style={{ marginHorizontal: SPACING.md, marginTop: -28 }}
        />

        {/* Categories Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: SPACING.md,
            marginTop: SPACING.lg,
          }}
        >
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.name}
              icon={item.icon_name}     // ✅ emoji from DB
              iconBg={item.icon_bg}
              cardBg={item.card_bg}
              onPress={() =>
                navigation.navigate(ROUTES.SELL_SCRAP, {
                  category: item,   // ✅ pass full object (important)
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Button */}
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