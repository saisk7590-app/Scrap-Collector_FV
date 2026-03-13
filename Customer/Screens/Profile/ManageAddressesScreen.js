import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Plus, Edit2 } from "lucide-react-native";

import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";

import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../../src/lib/api";

const THEME = {
  primary: "#2563EB",
  background: "#F5F5F5",
  card: "#FFFFFF",
  textMain: "#1C1C1C",
  textSecondary: "#7A7A7A",
  radius: 16,
};

export default function ManageAddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      const data = await apiRequest("/addresses");
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      Alert.alert("Error", "Failed to load addresses. Please ensure you have run the updated SQL schema in pgAdmin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Manage Addresses"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 50 }} />
        ) : addresses.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
             <MapPin size={48} color="#D1D5DB" />
             <Text style={{ color: '#9CA3AF', marginTop: 10 }}>No addresses found</Text>
          </View>
        ) : (
          addresses.map((item) => (
            <View key={item.id} style={styles.card}>
              <MapPin size={18} color={THEME.primary} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.type}>{item.type}</Text>
                  {item.is_default && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
                <Text style={styles.address}>{item.address}</Text>
              </View>

              <IconButton
                icon={<Edit2 size={18} color={THEME.primary} />}
                onPress={() => navigation.navigate("EditAddress", { addressItem: item })}
              />
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.addBtnWrapper}>
        <CustomButton
          title="Add New Address"
          variant="info"
          icon={<Plus size={20} color="#FFF" />}
          onPress={() => navigation.navigate("AddAddress")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: THEME.radius,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.textMain,
  },
  address: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    fontSize: 10,
    backgroundColor: "#DBEAFE",
    color: "#2563EB",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: "600",
  },
  addBtnWrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
});
