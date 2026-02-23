import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

export default function PickupSuccessScreen({ navigation, route }) {
  const { time, alternateNumber } = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }, 5000); // stays for 5 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <CheckCircle size={48} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Pickup Scheduled!</Text>

        <Text style={styles.subtitle}>
          Your pickup has been confirmed.
        </Text>

        <Text style={styles.timeText}>
          Collector will arrive at{" "}
          <Text style={styles.timeHighlight}>{time}</Text>
        </Text>

        {alternateNumber ? (
          <Text style={styles.altText}>
            Alternate contact:{" "}
            <Text style={styles.altHighlight}>
              +91 {alternateNumber}
            </Text>
          </Text>
        ) : null}

        <Text style={styles.redirect}>
          Redirecting to home...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  timeText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  timeHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  altText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  altHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  redirect: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
