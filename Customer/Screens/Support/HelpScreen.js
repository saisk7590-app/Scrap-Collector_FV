import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import OptionItem from "../../components/OptionItem";
import ContactCard from "../../components/ContactCard";

export default function HelpScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* White / light header */}
      <Header
        variant="default"     // light header
        title="Help & Support"
        showBack={true}       // show back button
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <OptionItem
          title="FAQs"
          icon="help-circle-outline"
          iconType="ionicons"
          onPress={() => navigation.navigate("FAQ")}
        />

        <OptionItem
          title="How Pickup Works"
          icon="cube-outline"
          iconType="ionicons"
          onPress={() => navigation.navigate("PickupGuide")}
        />

        <OptionItem
          title="Payment & Wallet Help"
          icon="wallet-outline"
          iconType="ionicons"
          onPress={() => navigation.navigate("WalletHelp")}
        />

        <OptionItem
          title="Account Issues"
          icon="person-circle-outline"
          iconType="ionicons"
          onPress={() => navigation.navigate("AccountIssues")}
        />

        <OptionItem
          title="Raise a Ticket"
          icon="chatbox-ellipses-outline"
          iconType="ionicons"
          onPress={() => navigation.navigate("RaiseTicket")}
        />

        {/* Contact Info */}
        <ContactCard
          title="Contact Support"
          phone="+91 9XXXXXXXXX"
          email="support@scrapcollector.in"
          hours="9 AM – 6 PM"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
