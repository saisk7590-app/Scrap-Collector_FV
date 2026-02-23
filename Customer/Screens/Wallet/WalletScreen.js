import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import { COLORS, SPACING, RADIUS } from "../../constants";

export default function WalletScreen() {
  const [walletBalance, setWalletBalance] = useState(1500);

  const [transactions, setTransactions] = useState([
    { type: "credit", title: "Scrap Pickup", date: "Dec 15", amount: 500 },
    { type: "credit", title: "Scrap Pickup", date: "Dec 10", amount: 1000 },
  ]);

  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      Alert.alert("Enter valid amount");
      return;
    }

    if (amount > walletBalance) {
      Alert.alert("Insufficient Balance");
      return;
    }

    setWalletBalance(prev => prev - amount);

    setTransactions(prev => [
      {
        type: "debit",
        title: "Withdrawal",
        date: "Today",
        amount,
      },
      ...prev,
    ]);

    setWithdrawAmount("");
    setShowWithdrawInput(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      <Header title="Wallet" showBack />

      <ScrollView contentContainerStyle={{ padding: SPACING.md }}>

        {/* BALANCE CARD */}
        <View
          style={{
            backgroundColor: COLORS.walletPrimary,
            borderRadius: RADIUS.lg,
            padding: SPACING.lg,
            marginBottom: SPACING.xl,
          }}
        >
          <Text style={{ color: COLORS.walletTextLight, fontSize: 14 }}>
            Available Balance
          </Text>

          <Text
            style={{
              color: COLORS.white,
              fontSize: 32,
              fontWeight: "700",
              marginVertical: SPACING.sm,
            }}
          >
            ₹ {walletBalance}
          </Text>

          {/* Withdraw Input (INLINE) */}
          {showWithdrawInput && (
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.md,
                padding: SPACING.sm,
                marginBottom: SPACING.sm,
              }}
            >
              <TextInput
                placeholder="Enter amount"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                style={{
                  fontSize: 16,
                  color: COLORS.textPrimary,
                }}
              />
            </View>
          )}

          {/* ACTIONS */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() =>
                showWithdrawInput
                  ? handleWithdraw()
                  : setShowWithdrawInput(true)
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.walletActionBg,
                paddingVertical: SPACING.xs,
                paddingHorizontal: SPACING.lg,
                borderRadius: RADIUS.pill,
                marginRight: SPACING.sm,
              }}
            >
              <Ionicons
                name="cash-outline"
                size={18}
                color={COLORS.walletPrimary}
              />
              <Text
                style={{
                  marginLeft: SPACING.xs,
                  color: COLORS.walletPrimary,
                  fontWeight: "600",
                }}
              >
                {showWithdrawInput ? "Confirm" : "Withdraw"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert("Add Bank", "Coming soon")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.walletActionBg,
                paddingVertical: SPACING.xs,
                paddingHorizontal: SPACING.lg,
                borderRadius: RADIUS.pill,
              }}
            >
              <Ionicons
                name="card-outline"
                size={18}
                color={COLORS.walletPrimary}
              />
              <Text
                style={{
                  marginLeft: SPACING.xs,
                  color: COLORS.walletPrimary,
                  fontWeight: "600",
                }}
              >
                Add Bank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TRANSACTIONS */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: COLORS.textPrimary,
            marginBottom: SPACING.sm,
          }}
        >
          Recent Transactions
        </Text>

        {transactions.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              marginBottom: SPACING.sm,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
                {item.date}
              </Text>
            </View>

            <Text
              style={{
                fontWeight: "700",
                color:
                  item.type === "credit"
                    ? COLORS.success
                    : COLORS.error,
              }}
            >
              {item.type === "credit" ? "+" : "-"}₹{item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
