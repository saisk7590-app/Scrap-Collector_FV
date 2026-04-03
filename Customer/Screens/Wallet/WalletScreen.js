import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet as WalletIcon } from "lucide-react-native";

import Header from "../../components/Header";
import { useAppTheme } from "../../context/ThemeContext";
import { apiRequest } from "../../src/lib/api";

const RUPEE = "\u20B9";
const currency = (amount) => `${RUPEE}${Number(amount || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function WalletScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loadError, setLoadError] = useState("");

  const fetchWallet = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [profileResponse, transactionsResponse] = await Promise.all([
        apiRequest("/profile"),
        apiRequest("/wallet/transactions"),
      ]);

      if (profileResponse.profile?.walletBalance != null) {
        setWalletBalance(Number(profileResponse.profile.walletBalance));
      } else if (transactionsResponse.balance != null) {
        setWalletBalance(Number(transactionsResponse.balance));
      } else {
        setWalletBalance(0);
      }

      setTransactions(transactionsResponse.transactions || []);
      setLoadError("");
    } catch (error) {
      setLoadError(error?.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWallet({ silent: false });
    }, [])
  );

  const handleWithdraw = async () => {
    const amount = Number.parseFloat(withdrawAmount.trim());

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Enter a valid withdrawal amount.");
      return;
    }

    if (amount > walletBalance) {
      Alert.alert("Insufficient balance", "Withdrawal amount exceeds your available balance.");
      return;
    }

    try {
      setWithdrawing(true);
      await apiRequest("/wallet/withdraw", "POST", { amount });
      setWithdrawAmount("");
      setShowWithdrawInput(false);
      await fetchWallet({ silent: true });
      Alert.alert("Withdrawal successful", `${currency(amount)} has been deducted from your wallet.`);
    } catch (error) {
      Alert.alert("Withdrawal failed", error?.message || "Unable to process withdrawal right now.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Wallet" showBack />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{currency(walletBalance)}</Text>

            {showWithdrawInput ? (
              <View style={styles.withdrawCard}>
                <TextInput
                  placeholder="Enter amount"
                  keyboardType="decimal-pad"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  style={styles.withdrawInput}
                  placeholderTextColor={colors.textSoft}
                  editable={!withdrawing}
                />
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => (showWithdrawInput ? handleWithdraw() : setShowWithdrawInput(true))}
                style={[styles.actionButton, withdrawing && styles.actionButtonDisabled]}
                disabled={withdrawing}
              >
                {withdrawing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <WalletIcon size={18} color={colors.primary} />
                )}
                <Text style={styles.actionButtonText}>{showWithdrawInput ? "Confirm" : "Withdraw"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert("Add Bank", "Coming soon")}
                style={styles.actionButton}
                disabled={withdrawing}
              >
                <CreditCard size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Add Bank</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {refreshing ? <ActivityIndicator size="small" color={colors.primary} /> : null}
          </View>

          {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}

          {transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>Wallet activity will appear here once credits or withdrawals are recorded.</Text>
            </View>
          ) : (
            transactions.map((item) => {
              const isCredit = String(item.type || "").toUpperCase() === "CREDIT";
              return (
                <View key={item.id} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIcon, { backgroundColor: isCredit ? colors.primarySoft : colors.dangerSoft }]}>
                      {isCredit ? (
                        <ArrowDownLeft size={16} color={colors.primary} />
                      ) : (
                        <ArrowUpRight size={16} color={colors.danger} />
                      )}
                    </View>
                    <View style={styles.transactionTextWrap}>
                      <Text style={styles.transactionTitle}>{item.description || (isCredit ? "Wallet Credit" : "Wallet Debit")}</Text>
                      <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                    </View>
                  </View>

                  <Text style={[styles.transactionAmount, { color: isCredit ? colors.primary : colors.danger }]}>
                    {isCredit ? `+${RUPEE}` : `-${RUPEE}`}{Number(item.amount || 0).toFixed(2)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loaderWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
    },
    balanceLabel: {
      color: "#DDF8E8",
      fontSize: 14,
    },
    balanceAmount: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "700",
      marginVertical: 10,
    },
    withdrawCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      paddingHorizontal: 14,
      marginBottom: 12,
    },
    withdrawInput: {
      minHeight: 48,
      fontSize: 16,
      color: "#111827",
    },
    actionRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 4,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F0FFF4",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      gap: 8,
    },
    actionButtonDisabled: {
      opacity: 0.7,
    },
    actionButtonText: {
      color: colors.primary,
      fontWeight: "700",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    emptyText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
    },
    transactionCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    transactionIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
    },
    transactionTextWrap: {
      flex: 1,
    },
    transactionTitle: {
      color: colors.text,
      fontWeight: "600",
      fontSize: 14,
    },
    transactionDate: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },
    transactionAmount: {
      fontWeight: "700",
      fontSize: 14,
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
      marginBottom: 12,
    },
  });
