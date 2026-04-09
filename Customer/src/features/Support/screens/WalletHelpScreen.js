import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletHelpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment & Wallet Help</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.title}>Wallet & Payment Info</Text>

        <View style={styles.point}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.pointText}>Your wallet shows earnings from completed pickups.</Text>
        </View>
        <View style={styles.point}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.pointText}>Withdraw to bank anytime using the Withdraw button.</Text>
        </View>
        <View style={styles.point}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.pointText}>Minimum withdrawal limit is ₹100 (example).</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 16, color: "#111" },
  point: { flexDirection: "row", marginBottom: 10 },
  bullet: { fontSize: 16, fontWeight: "700", width: 20, color: "#2563EB" },
  pointText: { fontSize: 15, color: "#111", flex: 1 },
});
