import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet as WalletIcon } from "lucide-react-native";

import Header from "@components/Header";
import { useAppTheme } from "@context/ThemeContext";
import { apiRequest } from "@lib/api";

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

      // Prefer wallet balance from profile, fall back to transactions endpoint
      if (profileResponse.profile?.walletBalance != null) {
        setWalletBalance(Number(profileResponse.profile.walletBalance));
      } else if (transactionsResponse.data?.balance != null) {
        setWalletBalance(Number(transactionsResponse.data.balance));
      } else if (transactionsResponse.balance != null) {
        setWalletBalance(Number(transactionsResponse.balance));
      } else {
        setWalletBalance(0);
      }

      const rawTxns =
        transactionsResponse.data?.transactions ||
        transactionsResponse.transactions ||
        [];

      // Deduplicate by id
      const uniqueTxns = [];
      const seen = new Set();
      rawTxns.forEach((tx) => {
        const key = tx.id ?? `${tx.type}-${tx.created_at}-${tx.amount}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueTxns.push(tx);
        }
      });
      uniqueTxns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setTransactions(uniqueTxns);
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

      // Refresh wallet data
      await fetchWallet({ silent: true });

      Alert.alert("Withdrawal successful", `${RUPEE}${amount.toFixed(2)} has been requested for withdrawal.`);
    } catch (error) {
      Alert.alert("Withdrawal failed", error?.message || "Unable to process withdrawal right now.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawInput(false);
    setWithdrawAmount("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Wallet" showBack />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) =>
            item.id != null ? item.id.toString() : `tx-${index}`
          }
          ListHeaderComponent={
            <>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>{currency(walletBalance)}</Text>

                {showWithdrawInput ? (
                  <View style={styles.withdrawCard}>
                    <TextInput
                      placeholder="Enter amount to withdraw"
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
                  {/* Withdraw / Confirm Button */}
                  <TouchableOpacity
                    onPress={() =>
                      showWithdrawInput ? handleWithdraw() : setShowWithdrawInput(true)
                    }
                    style={[styles.actionButton, withdrawing && styles.actionButtonDisabled]}
                    disabled={withdrawing}
                  >
                    {withdrawing ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <WalletIcon size={18} color={colors.primary} />
                    )}
                    <Text style={styles.actionButtonText}>
                      {showWithdrawInput ? "Confirm" : "Withdraw"}
                    </Text>
                  </TouchableOpacity>

                  {/* Cancel button (when entering amount) OR Add Bank (normal state) */}
                  {showWithdrawInput ? (
                    <TouchableOpacity
                      onPress={handleCancelWithdraw}
                      style={[styles.actionButton, styles.cancelButton]}
                      disabled={withdrawing}
                    >
                      <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => Alert.alert("Add Bank", "Coming soon")}
                      style={styles.actionButton}
                    >
                      <CreditCard size={18} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Add Bank</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {refreshing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : null}
              </View>

              {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>
                Wallet activity will appear here once credits or withdrawals are recorded.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isCredit = String(item.type || "").toUpperCase() === "CREDIT";
            const label = isCredit ? "Money Added" : "Withdrawal";
            const sublabel = item.description || (isCredit ? "Credit" : "Debit");
            const amountValue = Number(item.amount || 0).toFixed(2);

            return (
              <View style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: isCredit ? colors.primarySoft : colors.dangerSoft },
                    ]}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={16} color={colors.primary} />
                    ) : (
                      <ArrowUpRight size={16} color={colors.danger} />
                    )}
                  </View>
                  <View style={styles.transactionTextWrap}>
                    <Text style={styles.transactionTitle}>{label}</Text>
                    <Text style={styles.transactionDesc} numberOfLines={2}>
                      {sublabel}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: isCredit ? colors.primary : colors.danger },
                    ]}
                  >
                    {isCredit ? `+${RUPEE}${amountValue}` : `-${RUPEE}${amountValue}`}
                  </Text>
                  {item.balance_after != null && (
                    <Text style={styles.runningBalance}>
                      Bal: {currency(item.balance_after)}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={() => fetchWallet({ silent: true })}
          refreshing={refreshing}
        />
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
      flexWrap: "wrap",
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
    cancelButton: {
      backgroundColor: "#FFF1F2",
    },
    cancelButtonText: {
      color: "#E11D48",
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
      fontWeight: "700",
      fontSize: 14,
    },
    transactionDesc: {
      color: colors.textSoft,
      fontSize: 12,
      marginTop: 2,
    },
    transactionDate: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
    },
    transactionRight: {
      alignItems: "flex-end",
    },
    transactionAmount: {
      fontWeight: "700",
      fontSize: 15,
    },
    runningBalance: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 4,
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
      marginBottom: 12,
    },
  });
