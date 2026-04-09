import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CircleHelp, CircleUserRound, MessageSquareText, PackageOpen, Wallet } from "lucide-react-native";

import ContactCard from "@components/ContactCard";
import Header from "@components/Header";
import OptionItem from "@components/OptionItem";
import { useAppTheme } from "@context/ThemeContext";

export default function HelpScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const iconColor = colors.icon;

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Help & Support" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Help</Text>

          <OptionItem
            title="FAQs"
            icon={<CircleHelp />}
            iconColor={iconColor}
            onPress={() => navigation.navigate("FAQ")}
          />

          <OptionItem
            title="How Pickup Works"
            icon={<PackageOpen />}
            iconColor={iconColor}
            onPress={() => navigation.navigate("PickupGuide")}
          />

          <OptionItem
            title="Payment & Wallet Help"
            icon={<Wallet />}
            iconColor={iconColor}
            onPress={() => navigation.navigate("WalletHelp")}
          />

          <OptionItem
            title="Account Issues"
            icon={<CircleUserRound />}
            iconColor={iconColor}
            onPress={() => navigation.navigate("AccountIssues")}
          />

          <OptionItem
            title="Raise a Ticket"
            subtitle="Share your issue and our support team will follow up."
            icon={<MessageSquareText />}
            iconColor={iconColor}
            onPress={() => navigation.navigate("RaiseTicket")}
          />
        </View>

        <ContactCard
          title="Contact Support"
          phone="+91 9XXXXXXXXX"
          email="support@scrapcollector.in"
          hours="9 AM - 6 PM"
          onPhonePress={() => Linking.openURL("tel:+919000000000")}
          onEmailPress={() => Linking.openURL("mailto:support@scrapcollector.in")}
        />
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
      paddingBottom: 28,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
  });
