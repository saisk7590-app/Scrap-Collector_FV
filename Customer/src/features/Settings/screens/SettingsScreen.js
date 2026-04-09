import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FileText, Globe, Headphones, Info, Languages, Lock, ShieldCheck,
  Trash2,
  Palette,
  Bell
} from "lucide-react-native";

import Header from "@components/Header";
import OptionItem from "@components/OptionItem";
import { ROUTES } from "@constants/routes";
import { useAppTheme } from "@context/ThemeContext";

function Section({ title, children, colors }) {
  const styles = getStyles(colors);
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const goTo = (route) => navigation.navigate(route);

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Account" colors={colors}>
          <OptionItem
            title="Change Password"
            subtitle="Keep your account secure"
            icon={<Lock />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.CHANGE_PASSWORD)}
          />
          <OptionItem
            title="Delete Account"
            subtitle="Delete your account"
            icon={<Trash2 />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.DELETE_ACCOUNT)}
          />
        </Section>

        <Section title="Support" colors={colors}>
          <OptionItem
            title="Contact Support"
            subtitle="Reach our help team"
            icon={<Headphones />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.CONTACT_SUPPORT)}
          />
        </Section>

        <Section title="About" colors={colors}>
          <OptionItem
            title="About App"
            subtitle="Version, mission, and team"
            icon={<Info />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.ABOUT_APP)}
          />
          <OptionItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            icon={<ShieldCheck />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.PRIVACY_POLICY)}
          />
          <OptionItem
            title="Terms & Conditions"
            subtitle="Usage guidelines"
            icon={<FileText />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.TERMS)}
          />
        </Section>

        <Section title="Preferences" colors={colors}>
          <OptionItem
            title="Language"
            subtitle="Choose your preferred language"
            icon={<Languages />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.LANGUAGE)}
          />
          <OptionItem
            title="Theme"
            subtitle="Choose your preferred theme"
            icon={<Palette />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.THEME)}
          />
          <OptionItem
            title="Notifications"
            subtitle="Choose your preferred notifications"
            icon={<Bell />}
            iconColor={colors.icon}
            onPress={() => goTo(ROUTES.NOTIFICATION_SETTINGS)}
          />
        </Section>
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
      gap: 12,
    },
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: colors.mode === "dark" ? 0.14 : 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },
  });
