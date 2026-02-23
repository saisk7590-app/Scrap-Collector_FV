import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AuthProvider, useAuth } from "./context/AuthContext";

// ================= AUTH SCREENS =================
import SplashScreen from "./Screens/Auth/SplashScreen";
import LoginScreen from "./Screens/Auth/LoginScreen";
import SignUpScreen from "./Screens/Auth/SignUpScreen";

// ================= MAIN NAVIGATION =================
import HomeNavigator from "./Navigation/HomeNavigator"; // Bottom Tabs

// ================= MAIN FLOW SCREENS =================
import SellScrapScreen from "./Screens/Main/SellScrapScreen";
import PickupSummary from "./Screens/Main/PickupSummary";
import SchedulePickupScreen from "./Screens/Main/SchedulePickupScreen";
import SuccessScreen from "./Screens/Main/SuccessScreen";
import HistoryScreen from "./Screens/Main/HistoryScreen";

// ================= PROFILE & SETTINGS =================
import ProfileScreen from "./Screens/Profile/ProfileScreen";
import SettingsScreen from "./Screens/Settings/SettingsScreen";
import EditProfileScreen from "./Screens/Profile/EditProfileScreen";
import ManageAddressesScreen from "./Screens/Profile/ManageAddressesScreen";

// ================= WALLET =================
import WalletScreen from "./Screens/Wallet/WalletScreen";

// ================= SUPPORT =================
import HelpScreen from "./Screens/Support/HelpScreen";
import FAQScreen from "./Screens/Support/FAQScreen";
import PickupGuideScreen from "./Screens/Support/PickupGuideScreen";
import WalletHelpScreen from "./Screens/Support/WalletHelpScreen";
import AccountIssuesScreen from "./Screens/Support/AccountIssuesScreen";
import RaiseTicketScreen from "./Screens/Support/RaiseTicketScreen";
import NotificationsScreen from "./Screens/Support/NotificationsScreen";

// ================= COMING =================
import ComingSoonScreen from "./Screens/ComingSoonScreen";

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />; // Or a simpler empty loading view if you prefer
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // ================= AUTH FLOW =================
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          // ================= MAIN APP FLOW =================
          <>
            <Stack.Screen name="Home" component={HomeNavigator} />

            {/* ================= SCRAP FLOW ================= */}
            <Stack.Screen name="SellScrap" component={SellScrapScreen} />
            <Stack.Screen name="PickupSummary" component={PickupSummary} />
            <Stack.Screen name="SchedulePickup" component={SchedulePickupScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />

            {/* ================= OTHER SCREENS ================= */}
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ManageAddresses" component={ManageAddressesScreen} />
            {/* ================= SUPPORT SCREENS ================= */}
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="FAQ" component={FAQScreen} />
            <Stack.Screen name="PickupGuide" component={PickupGuideScreen} />
            <Stack.Screen name="WalletHelp" component={WalletHelpScreen} />
            <Stack.Screen name="AccountIssues" component={AccountIssuesScreen} />
            <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            {/*================= COMING =================*/}
            <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
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
      <Toast />
    </SafeAreaProvider>
  );
}
