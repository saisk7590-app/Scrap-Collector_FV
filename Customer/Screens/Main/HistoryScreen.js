import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Clock, CheckCircle } from "lucide-react-native";

import Header from "../../components/Header";
import PickupCard from "../../components/PickupCard";
import SectionHeader from "../../components/SectionHeader";
import WalletInfoCard from "../../components/WalletInfoCard";

import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/spacing";
import { apiRequest } from "../../src/lib/api";

export default function HistoryScreen() {
  const navigation = useNavigation();

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const data = await apiRequest("/pickups/my");
      setPickups(data.pickups || []);
    } catch (err) {
      console.log("Error fetching pickups:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedPickups = pickups.filter(p => p.status === "completed");
  const pendingPickups = pickups.filter(p => p.status === "scheduled");

  const totalEarnings = completedPickups.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const totalScrap = completedPickups.reduce(
    (sum, p) => sum + Number(p.total_qty || 0),
    0
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
        <Header
          variant="main"
          title="Pickup History"
          showBack
        />

        <WalletInfoCard
          balance={totalEarnings}
          totalScrap={totalScrap}
          variant="history"
          style={{
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
            marginBottom: SPACING.md
          }}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: SPACING.md }}>
        {pendingPickups.length > 0 && (
          <>
            <SectionHeader
              icon={Clock}
              title="Pending Pickups"
              color={COLORS.warning}
            />
            {pendingPickups.map(item => (
              <PickupCard key={item.id} data={item} />
            ))}
          </>
        )}

        <SectionHeader
          icon={CheckCircle}
          title="Completed Pickups"
          color={COLORS.success}
        />
        {completedPickups.map(item => (
          <PickupCard key={item.id} data={item} />
        ))}
      </ScrollView>
    </View>
  );
}
