import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import OptionItem from "../../components/OptionItem";
import { Bell, FileText, Globe, Info, Trash2 } from "lucide-react-native";

export default function SettingsScreen({ navigation }) {
  const [showPolicies, setShowPolicies] = useState(false);

  const goToComingSoon = (title) => navigation.navigate("ComingSoon", { title });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* White / light header */}
      <Header
        variant="default"   // light header
        title="Settings"
        showBack={true}     // show back button
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <OptionItem
          title="Notifications"
          icon={<Bell />}
          onPress={() => goToComingSoon("Notifications")}
        />

        <OptionItem
          title="Language"
          icon={<Globe />}
          onPress={() => goToComingSoon("Language")}
        />

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

        <OptionItem
          title="Delete Account"
          icon={<Trash2 />}
          danger
          onPress={() => goToComingSoon("Delete Account")}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
