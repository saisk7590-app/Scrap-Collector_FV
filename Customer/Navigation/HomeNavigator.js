import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Recycle, FileText, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, SIZES, ROUTES, FONTS } from "../constants";

import HomeScreen from "../Screens/Main/HomeScreen";
import HistoryScreen from "../Screens/Main/HistoryScreen";
import ProfileScreen from "../Screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,

        tabBarStyle: {
          height: SIZES.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom, // ✅ FIXED
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: FONTS.medium, // ✅ NOT fontWeight
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Recycle color={color} size={SIZES.icon} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.HISTORY}
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <FileText color={color} size={SIZES.icon} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User color={color} size={SIZES.icon} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
