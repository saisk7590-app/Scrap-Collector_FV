import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      // No token, or token is literally "undefined" / "null" (corrupted)
      if (!token || token === "undefined" || token === "null") {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userData");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Error reading token:", e);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, userData) => {
    try {
      if (token) await AsyncStorage.setItem("authToken", token);
      if (userData) await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Error passing token to AuthContext:", e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
