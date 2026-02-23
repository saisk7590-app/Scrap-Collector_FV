import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ===== SCREENS ===== */
import SignUpScreen from "./Screens/Auth/SignUpScreen";
import LoginScreen from "./Screens/Auth/LoginScreen";
import CollectorDashboardScreen from "./Screens/Dashboard/CollectorDashboardScreen";
import PickupDetailsScreen from "./Screens/Pickups/PickupDetailsScreen";
import PickupActionScreen from "./Screens/Pickups/PickupActionScreen"; // ✅ ADD THIS
import PickupHistoryScreen from "./Screens/Pickups/PickupHistoryScreen"
import InvoiceScreen from "./Screens/Invoice/InvoiceScreen";
import CollectorProfileScreen from "./Screens/Profile/CollectorProfileScreen";

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            {/* Dashboard */}
            <Stack.Screen name="CollectorDashboard" component={CollectorDashboardScreen} />
            <Stack.Screen name="PickupDetails" component={PickupDetailsScreen} />
            <Stack.Screen name="PickupAction" component={PickupActionScreen} />
            <Stack.Screen name="PickupHistory" component={PickupHistoryScreen} />

            {/* Invoice */}
            <Stack.Screen name="Invoice" component={InvoiceScreen} />

            {/* Profile / Logout */}
            <Stack.Screen name="CollectorProfile" component={CollectorProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationWrapper />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
