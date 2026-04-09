import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock3, Mail, Phone } from "lucide-react-native";
import { useAppTheme } from "@context/ThemeContext";

export default function ContactCard({ title, phone, email, hours, onPhonePress, onEmailPress }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.row} onPress={onPhonePress} activeOpacity={0.75}>
        <View style={styles.iconWrap}>
          <Phone size={16} color={colors.icon} />
        </View>
        <View>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.link}>{phone}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={onEmailPress} activeOpacity={0.75}>
        <View style={styles.iconWrap}>
          <Mail size={16} color={colors.icon} />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.link}>{email}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Clock3 size={16} color={colors.icon} />
        </View>
        <View>
          <Text style={styles.label}>Support hours</Text>
          <Text style={styles.text}>{hours}</Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    box: {
      marginTop: 22,
      padding: 18,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 14,
      color: colors.text,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
    text: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
    },
    link: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "700",
    },
  });
