import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Recycle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, ROUTES } from "../../constants";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();

    // App.js handles the loading state now, so this screen 
    // just shows the animation while AuthContext initiates.
  }, [bounceAnim, fadeAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
          <Recycle size={SIZES.logo} strokeWidth={2} color={COLORS.background} />
        </Animated.View>
        <Text style={styles.appName}>Scrap Collector</Text>
        <Text style={styles.subtitle}>Your Eco-Friendly Partner</Text>
        <Text style={styles.quote}>-------</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    marginTop: SIZES.spacingLg,
    fontSize: FONTS.size.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  subtitle: {
    marginTop: SIZES.spacingSm,
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.medium,
    color: COLORS.background,
    opacity: 0.9,
  },
  quote: {
    marginTop: SIZES.spacingMd,
    fontSize: FONTS.size.md,
    fontFamily: FONTS.regular,
    color: COLORS.background,
    opacity: 0.8,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: SIZES.spacingLg,
  },
});
