import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "appThemePreference";

const paletteByMode = {
  light: {
    mode: "light",
    background: "#F5F7F6",
    surface: "#FFFFFF",
    surfaceAlt: "#EEF4F0",
    border: "#D8E1DD",
    text: "#14221B",
    textMuted: "#66756D",
    textSoft: "#8A9790",
    primary: "#03C75A",
    primarySoft: "#DDF8E8",
    icon: "#6B7280",
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
    shadow: "#111827",
    overlay: "rgba(17, 24, 39, 0.12)",
  },
  dark: {
    mode: "dark",
    background: "#0D1511",
    surface: "#14201A",
    surfaceAlt: "#1B2A22",
    border: "#25372E",
    text: "#F4FBF6",
    textMuted: "#A8B6AF",
    textSoft: "#86948E",
    primary: "#22C55E",
    primarySoft: "#193925",
    icon: "#A8B6AF",
    danger: "#F87171",
    dangerSoft: "#3C1F22",
    shadow: "#000000",
    overlay: "rgba(0, 0, 0, 0.28)",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [themePreference, setThemePreference] = useState("system");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
          setThemePreference(storedTheme);
        }
      } finally {
        setThemeReady(true);
      }
    })();
  }, []);

  const setTheme = async (nextTheme) => {
    setThemePreference(nextTheme);
    await AsyncStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const themeMode = themePreference === "system" ? systemScheme : themePreference;
  const colors = paletteByMode[themeMode];

  const value = useMemo(
    () => ({
      colors,
      themeMode,
      themePreference,
      themeReady,
      setTheme,
    }),
    [colors, themeMode, themePreference, themeReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
}
