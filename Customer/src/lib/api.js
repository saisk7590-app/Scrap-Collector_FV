import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================
// 🔧 CHANGE THIS WHEN DEPLOYING TO PRODUCTION
// ============================================
// For local dev with Expo:
//   - Android Emulator: http://10.0.2.2:5000/api
//   - iOS Simulator:    http://localhost:5000/api
//   - Physical device:  http://<YOUR_PC_IP>:5000/api
//   - Production:       https://your-domain.com/api
import { Platform } from "react-native";

// ============================================
// 🔧 CHANGE THIS WHEN DEPLOYING TO PRODUCTION
// ============================================
// For local dev with Expo:
//   - Web Browser:      http://localhost:5000/api
//   - Android Emulator: http://10.0.2.2:5000/api
//   - iOS/Physical:     http://<YOUR_PC_IP>:5000/api
//
// 💡 TIP: Use your computer's IP address (e.g., 192.168.x.x) for physical devices.
const LOCAL_IP = "192.168.1.100"; // 👈 Update this to your ACTUAL PC IP
const API_URL = Platform.OS === "web" ? "http://localhost:5000/api" : `http://${LOCAL_IP}:5000/api`;

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

        return data;
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
