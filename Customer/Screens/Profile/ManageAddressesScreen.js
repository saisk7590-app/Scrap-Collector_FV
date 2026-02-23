import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Plus, Edit2 } from "lucide-react-native";

import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";

const THEME = {
  primary: "#2563EB",
  background: "#F5F5F5",
  card: "#FFFFFF",
  textMain: "#1C1C1C",
  textSecondary: "#7A7A7A",
  radius: 16,
};

export default function ManageAddressScreen({ navigation }) {
  const [addresses] = useState([
    { id: 1, type: "Home", address: "Hyderabad, Telangana" },
    { id: 2, type: "Office", address: "Hitech City, Hyderabad" },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Use Header component */}
      <Header
        variant="default"  // light/white header
        title="Manage Addresses"
        showBack={true}    // show back button
      />

      <ScrollView contentContainerStyle={styles.container}>
        {addresses.map((item) => (
          <View key={item.id} style={styles.card}>
            <MapPin size={18} color={THEME.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>

            <IconButton
              icon ={<Edit2 size={18} color={THEME.primary} />}
              onPress={() => navigation.navigate("EditAddress")}
            />
              
            
          </View>
        ))}
      </ScrollView>

      {/* Add Address Button */}
      <View style={styles.addBtnWrapper}>
        <CustomButton
          title= "Add New Address"
          variant= "info"
          icon={<Plus size={20} color="#FFF" />}
          onPress={()=> navigation.navigate("AddAddress")}
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
  addBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addBtnWrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
});
