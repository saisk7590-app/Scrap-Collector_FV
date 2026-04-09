import React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AuthProvider, useAuth } from "@context/AuthContext";
import { ThemeProvider, useAppTheme } from "@context/ThemeContext";
import { ROUTES } from "@constants/routes";

// ================= AUTH SCREENS =================
import SplashScreen from "@features/Auth/screens/SplashScreen";
import LoginScreen from "@features/Auth/screens/LoginScreen";
import SignUpScreen from "@features/Auth/screens/SignUpScreen";
import ForgotPasswordScreen from "@features/Auth/screens/ForgotPasswordScreen";
// ================= CUSTOMER NAVIGATION =================
import HomeNavigator from "@navigation/HomeNavigator";

// ================= CUSTOMER FLOW SCREENS =================
import SellScrapScreen from "@features/Main/screens/SellScrapScreen";
import PickupSummary from "@features/Main/screens/PickupSummary";
import SchedulePickupScreen from "@features/Main/screens/SchedulePickupScreen";
import SuccessScreen from "@features/Main/screens/SuccessScreen";
import HistoryScreen from "@features/Main/screens/HistoryScreen";

// ================= CUSTOMER PROFILE SCREENS =================
import ProfileScreen from "@features/Profile/screens/ProfileScreen";

import EditProfileScreen from "@features/Profile/screens/EditProfileScreen";
import ManageAddressesScreen from "@features/Profile/screens/ManageAddressesScreen";
import AddAddressScreen from "@features/Profile/screens/AddAddressScreen";
import EditAddressScreen from "@features/Profile/screens/EditAddressScreen";
// ================= CUSTOMER SETTINGS SCREENS =================
import SettingsScreen from "@features/Settings/screens/SettingsScreen";
import ChangePasswordScreen from "@features/Settings/screens/ChangePasswordScreen";
import ContactSupportScreen from "@features/Settings/screens/ContactSupportScreen";
import AboutAppScreen from "@features/Settings/screens/AboutAppScreen";
import PrivacyPolicyScreen from "@features/Settings/screens/PrivacyPolicyScreen";
import TermsScreen from "@features/Settings/screens/TermsScreen";
import LanguageScreen from "@features/Settings/screens/LanguageScreen";
import DeleteAccountScreen from "@features/Settings/screens/DeleteAccountScreen";
import ThemeScreen from "@features/Settings/screens/ThemeScreen";
import NotificationSettingsScreen from "@features/Settings/screens/NotificationSettingsScreen";

// ================= WALLET =================
import WalletScreen from "@features/Wallet/screens/WalletScreen";

// ================= SUPPORT =================
import HelpScreen from "@features/Support/screens/HelpScreen";
import FAQScreen from "@features/Support/screens/FAQScreen";
import PickupGuideScreen from "@features/Support/screens/PickupGuideScreen";
import WalletHelpScreen from "@features/Support/screens/WalletHelpScreen";
import AccountIssuesScreen from "@features/Support/screens/AccountIssuesScreen";
import RaiseTicketScreen from "@features/Support/screens/RaiseTicketScreen";
import NotificationsScreen from "@features/Support/screens/NotificationsScreen";

// ================= COMING SOON =================
import ComingSoonScreen from "@screens/ComingSoonScreen";

// ================= COLLECTOR SCREENS =================
import CollectorDashboardScreen from "@features/Dashboard/screens/CollectorDashboardScreen";
import PickupDetailsScreen from "@features/Pickups/screens/PickupDetailsScreen";
import PickupActionScreen from "@features/Pickups/screens/PickupActionScreen";
import PickupHistoryScreen from "@features/Pickups/screens/PickupHistoryScreen";
import InvoiceScreen from "@features/Invoice/screens/InvoiceScreen";
import CollectorProfileScreen from "@features/Profile/screens/CollectorProfileScreen";

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const { colors, themeMode, themeReady } = useAppTheme();

  if (isLoading || !themeReady) {
    return <SplashScreen />;
  }

  const navigationTheme = {
    ...(themeMode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeMode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!isAuthenticated ? (
          // ================= AUTH FLOW =================
          <>
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.SIGNUP} component={SignUpScreen} />
            <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
          </>

        ) : userRole === "collector" ? (
          // ================= COLLECTOR APP FLOW =================
          <>
            <Stack.Screen name={ROUTES.COLLECTOR_DASHBOARD} component={CollectorDashboardScreen} />
            <Stack.Screen name={ROUTES.PICKUP_DETAILS} component={PickupDetailsScreen} />
            <Stack.Screen name={ROUTES.PICKUP_ACTION} component={PickupActionScreen} />
            <Stack.Screen name={ROUTES.PICKUP_HISTORY} component={PickupHistoryScreen} />
            <Stack.Screen name={ROUTES.INVOICE} component={InvoiceScreen} />
            <Stack.Screen name={ROUTES.COLLECTOR_PROFILE} component={CollectorProfileScreen} />
            <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
            <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} />
            <Stack.Screen name={ROUTES.CONTACT_SUPPORT} component={ContactSupportScreen} />
            <Stack.Screen name={ROUTES.ABOUT_APP} component={AboutAppScreen} />
            <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
            <Stack.Screen name={ROUTES.TERMS} component={TermsScreen} />
            <Stack.Screen name={ROUTES.LANGUAGE} component={LanguageScreen} />
            <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
            <Stack.Screen name={ROUTES.COMING_SOON} component={ComingSoonScreen} />
          </>

        ) : (
          // ================= CUSTOMER APP FLOW =================
          <>
            <Stack.Screen name="MainTabs" component={HomeNavigator} />

            {/* ================= SCRAP FLOW ================= */}
            <Stack.Screen name={ROUTES.SELL_SCRAP} component={SellScrapScreen} />
            <Stack.Screen name={ROUTES.PICKUP_SUMMARY} component={PickupSummary} />
            <Stack.Screen name={ROUTES.SCHEDULE_PICKUP} component={SchedulePickupScreen} />
            <Stack.Screen name={ROUTES.SUCCESS} component={SuccessScreen} />

            {/* ================= OTHER SCREENS ================= */}
            <Stack.Screen name="HistoryStack" component={HistoryScreen} />

            {/* ================= CUSTOMER PROFILE SCREENS ================= */}
            <Stack.Screen name="ProfileStack" component={ProfileScreen} />
            <Stack.Screen name={ROUTES.WALLET} component={WalletScreen} />
            <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
            <Stack.Screen name={ROUTES.MANAGE_ADDRESSES} component={ManageAddressesScreen} />
            <Stack.Screen name={ROUTES.ADD_ADDRESS} component={AddAddressScreen} />
            <Stack.Screen name={ROUTES.EDIT_ADDRESS} component={EditAddressScreen} />

            {/* ================= CUSTOMER SETTINGS SCREENS ================= */}
            <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
            <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} />
            <Stack.Screen name={ROUTES.CONTACT_SUPPORT} component={ContactSupportScreen} />
            <Stack.Screen name={ROUTES.ABOUT_APP} component={AboutAppScreen} />
            <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
            <Stack.Screen name={ROUTES.TERMS} component={TermsScreen} />
            <Stack.Screen name={ROUTES.LANGUAGE} component={LanguageScreen} />
            <Stack.Screen name={ROUTES.DELETE_ACCOUNT} component={DeleteAccountScreen} />
            <Stack.Screen name={ROUTES.THEME} component={ThemeScreen} />
            <Stack.Screen name={ROUTES.NOTIFICATION_SETTINGS} component={NotificationSettingsScreen} />

            {/* ================= SUPPORT SCREENS ================= */}
            <Stack.Screen name={ROUTES.HELP} component={HelpScreen} />
            <Stack.Screen name={ROUTES.FAQ} component={FAQScreen} />
            <Stack.Screen name="PickupGuide" component={PickupGuideScreen} />
            <Stack.Screen name="WalletHelp" component={WalletHelpScreen} />
            <Stack.Screen name="AccountIssues" component={AccountIssuesScreen} />
            <Stack.Screen name={ROUTES.RAISE_TICKET} component={RaiseTicketScreen} />
            <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />

            {/* ================= COMING SOON ================= */}
            <Stack.Screen name={ROUTES.COMING_SOON} component={ComingSoonScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationWrapper />
        </AuthProvider>
      </ThemeProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
