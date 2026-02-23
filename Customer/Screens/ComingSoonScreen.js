import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, PixelRatio } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Responsive font function
const scaleFont = (size) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const scale = SCREEN_WIDTH / 375; // 375 is base width (iPhone 8)
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function ComingSoonScreen({ navigation, route }) {
  const title = route?.params?.title || "Coming Soon";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={scaleFont(24)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            This feature is under development 🚧
          </Text>
          <Text style={styles.note}>
            We are working hard to bring this to you soon.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#03C75A",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: scaleFont(18),
    fontWeight: "600",
    marginLeft: 12,
    flexShrink: 1, // prevents text overflow
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  title: {
    fontSize: scaleFont(22),
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: scaleFont(16),
    color: "#555",
    marginBottom: 6,
    textAlign: "center",
  },

  note: {
    fontSize: scaleFont(13),
    color: "#999",
    textAlign: "center",
  },
});
