import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut, ArrowLeft } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function CollectorProfileScreen() {
    const { signOut } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirmLogout = window.confirm("Are you sure you want to logout?");
            if (confirmLogout) {
                await signOut();
            }
        } else {
            Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color="#111827" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile & Settings</Text>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.placeholderText}>
                        Collector profile settings go here...
                    </Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut color="#FFFFFF" size={20} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#6B7280",
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: "#EF4444",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 20,
    },
    logoutText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
