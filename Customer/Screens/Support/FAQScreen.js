import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FAQScreen({ navigation }) {
  // Sample FAQs
  const faqs = [
    {
      question: "How do I schedule a pickup?",
      answer: "Go to the Home screen → Sell Scrap → Select items → Schedule Pickup.",
    },
    {
      question: "How is scrap weight calculated?",
      answer: "Scrap is weighed by our collectors on pickup using a digital scale.",
    },
    {
      question: "How do I withdraw my wallet balance?",
      answer: "Go to Wallet → Withdraw → Enter bank details → Confirm.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQs</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* FAQ List */}
        {faqs.map((faq, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.questionRow}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answerText}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  answerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});
