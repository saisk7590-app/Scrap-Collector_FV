import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle,
  Clock,
  Wallet,
  Menu,
  Bell,
  History,
} from "lucide-react-native";
import { apiRequest, getStoredUser } from "../../src/lib/api";

const POLL_INTERVAL = 30000; // 30 seconds

export default function CollectorDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [todayPickups, setTodayPickups] = useState([]);
  const [collectorName, setCollectorName] = useState("Collector");
  const [stats, setStats] = useState({
    todayPickups: 0,
    pending: 0,
    completed: 0,
    todayEarnings: 0,
  });

  const pollRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchTodayPickups();

    // ✅ POLLING (replaces Supabase realtime)
    pollRef.current = setInterval(() => {
      fetchTodayPickups();
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  /* FETCH COLLECTOR NAME */
  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/profile");
      if (data.profile?.fullName) {
        setCollectorName(data.profile.fullName);
      }
    } catch (err) {
      // Fallback to stored data
      const storedUser = await getStoredUser();
      if (storedUser?.fullName) {
        setCollectorName(storedUser.fullName);
      }
    }
  };

  /* FETCH TODAY PICKUPS */
  const fetchTodayPickups = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/pickups/today");
      const safeData = data.pickups || [];

      const pending = safeData.filter(
        (p) => p.status === "scheduled"
      ).length;

      const completed = safeData.filter(
        (p) => p.status === "completed"
      ).length;

      const earnings = safeData
        .filter((p) => p.status === "completed")
        .reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0
        );

      setStats({
        todayPickups: safeData.length,
        pending,
        completed,
        todayEarnings: earnings,
      });

      setTodayPickups(safeData);
    } catch (err) {
      console.log("Pickup fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcome}>
                Welcome Back,
              </Text>
              <Text style={styles.username}>
                {collectorName}
              </Text>
            </View>

            <View style={styles.headerIcons}>
              <View style={styles.iconCircle}>
                <Bell color="#FFF" size={20} />
              </View>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => navigation.navigate("CollectorProfile")}
              >
                <Menu color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* BLUE STATS */}
          <View style={styles.headerStats}>
            <View style={styles.statCard}><Clock color="#E0F2FE" size={20} /><Text style={styles.statLabel}>Today's Pickups</Text><Text style={styles.statValue}>{stats.todayPickups}</Text></View>
            <View style={styles.statCard}><Wallet color="#E0F2FE" size={20} /><Text style={styles.statLabel}>Today's Earnings</Text><Text style={styles.statValue}>₹{stats.todayEarnings}</Text></View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* WHITE QUICK STATS */}
          <View style={styles.row}>
            <View style={styles.whiteCard}>
              <Clock color="#F97316" size={20} />
              <Text style={styles.cardLabel}>
                Pending
              </Text>
              <Text style={styles.cardValue}>
                {stats.pending} pickups
              </Text>
            </View>

            <View style={styles.whiteCard}>
              <CheckCircle color="#22C55E" size={20} />
              <Text style={styles.cardLabel}>
                Completed
              </Text>
              <Text style={styles.cardValue}>
                {stats.completed} pickups
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.navigate("PickupHistory")
            }
          >
            <History color="#2563EB" size={20} />
            <Text style={styles.secondaryButtonText}>
              View Pickup History
            </Text>
          </TouchableOpacity>

          {/* TODAY SCHEDULE */}
          <Text style={styles.sectionTitle}>
            Today's Schedule
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />
          ) : todayPickups.length === 0 ? (
            <Text style={styles.emptyText}>No pickups scheduled today</Text>
          ) : (
            todayPickups.map((pickup) => (
              <TouchableOpacity
                key={pickup.id}
                onPress={() =>
                  navigation.navigate("PickupDetails", {
                    pickup,
                  })
                }
              >
                <View
                  style={[
                    styles.scheduleCard,
                    {
                      borderLeftColor:
                        pickup.status === "scheduled"
                          ? "#F97316"
                          : "#22C55E",
                    },
                  ]}
                >
                  <Text style={styles.customerName}>
                    Pickup ID: {pickup.display_id || pickup.id.slice(0, 6)}
                  </Text>

                  <Text style={styles.subText}>
                    {Array.isArray(pickup.items)
                      ? pickup.items
                        .map((i) => i.name)
                        .join(", ")
                      : "Scrap Items"}
                  </Text>

                  <Text style={styles.timeText}>
                    {new Date(
                      pickup.created_at
                    ).toLocaleTimeString()}
                  </Text>

                  <Text
                    style={
                      pickup.status === "scheduled"
                        ? styles.pendingBadge
                        : styles.completedBadge
                    }
                  >
                    {pickup.status?.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES (unchanged) */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563EB" },
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  welcome: { color: "#DBEAFE", fontSize: 14 },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerIcons: { flexDirection: "row", gap: 10 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerStats: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 14,
  },
  statLabel: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 6,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  content: { padding: 20 },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
  },
  cardLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 6,
  },
  cardValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E0E7FF",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  scheduleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 5,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subText: {
    color: "#6B7280",
    marginTop: 4,
  },
  timeText: {
    color: "#9CA3AF",
    marginTop: 4,
  },
  pendingBadge: {
    marginTop: 6,
    color: "#F97316",
    fontWeight: "700",
  },
  completedBadge: {
    marginTop: 6,
    color: "#22C55E",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
  },
});
