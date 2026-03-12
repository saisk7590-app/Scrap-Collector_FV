import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'customer' | 'collector' | 'admin'

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
        setUserRole(null);
      } else {
        // Read stored user data to get role
        const userDataStr = await AsyncStorage.getItem("userData");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserRole(userData.role || "customer");
        }
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Error reading token:", e);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, userData) => {
    try {
      if (token) await AsyncStorage.setItem("authToken", token);
      if (userData) await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUserRole(userData?.role || "customer");
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
      setUserRole(null);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
