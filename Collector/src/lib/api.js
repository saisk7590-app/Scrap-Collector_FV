import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ============================================
// 🔧 API CONFIGURATION
// ============================================
// Switch ENV to control which backend the app talks to.
//
// "ngrok"       → Phone & PC on DIFFERENT networks (ngrok tunnel)
// "local"       → Phone & PC on SAME WiFi network
// "production"  → Deployed cloud backend
// ============================================
const ENV = "ngrok"; // 👈 CHANGE THIS AS NEEDED

const ENVIRONMENTS = {
    ngrok: {
        // Paste your ngrok HTTPS URL here (changes every restart on free plan)
        API_URL: "https://glottologic-petrifiedly-luanna.ngrok-free.dev/api",
    },
    local: {
        // Same WiFi: use your PC's local IP address
        API_URL:
            Platform.OS === "web"
                ? "http://localhost:5000/api"
                : Platform.OS === "android"
                    ? "http://10.0.2.2:5000/api"   // Android emulator
                    : "http://192.168.1.100:5000/api", // Physical device — update IP
    },
    production: {
        // Your deployed backend URL
        API_URL: "https://api.yourscrapcollector.com/api",
    },
};

const API_URL = ENVIRONMENTS[ENV].API_URL;

/**
 * Make an authenticated API request to the backend.
 * Automatically attaches JWT token from AsyncStorage.
 *
 * @param {string} endpoint - API endpoint (e.g. '/auth/login')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body (for POST/PUT)
 * @returns {Promise<object>} - Parsed JSON response
 */
export const apiRequest = async (endpoint, method = "GET", body = null) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body && (method === "POST" || method === "PUT")) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || "Something went wrong",
            };
        }

        // Backend wraps responses as { success, message, data: {...} }
        // Unwrap so callers can do: response.token, response.user, etc.
        return data.data ? { ...data, ...data.data } : data;
    } catch (err) {
        if (err.status) {
            throw err; // Re-throw API errors
        }
        throw { status: 0, message: "Cannot connect to server. Please check your internet connection." };
    }
};

/**
 * Save auth data (token + user) to AsyncStorage after login/register.
 */
export const saveAuthData = async (token, user) => {
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("userToken", user.id); // for backward compatibility
    await AsyncStorage.setItem("userData", JSON.stringify(user));
};

/**
 * Clear auth data on logout.
 */
export const clearAuthData = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
};

/**
 * Get stored user data.
 */
export const getStoredUser = async () => {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
};
