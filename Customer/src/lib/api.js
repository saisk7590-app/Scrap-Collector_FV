import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Set ENV to "ngrok" and update API_URL when you create a fresh tunnel.
// For stable development on emulator/device in same LAN, use "local".
const ENV = "ngrok"; // "ngrok" | "local" | "production"  

const LOCAL_API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : Platform.OS === "android"
      ? "http://10.0.2.2:5000/api"
      : "http://192.168.14.172:5000/api";

const ENVIRONMENTS = {
  ngrok: {
    API_URL: "https://glottologic-petrifiedly-luanna.ngrok-free.dev/api", // TODO: replace with your fresh ngrok https URL
  },
  local: {
    API_URL: LOCAL_API_URL,
  },
  production: {
    API_URL: "https://api.yourscrapcollector.com/api",
  },
};

const PRIMARY_API_URL = ENVIRONMENTS[ENV].API_URL;
const API_CANDIDATES = Array.from(new Set([PRIMARY_API_URL, LOCAL_API_URL]));
let preferredApiUrl = PRIMARY_API_URL;

export const API_URL = PRIMARY_API_URL;

const buildHeaders = async (extraHeaders = {}) => {
  const token = await AsyncStorage.getItem("authToken");
  const headers = {
    ...extraHeaders,
    "ngrok-skip-browser-warning": "true",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || "Something went wrong",
    };
  }

  return data?.data ? { ...data, ...data.data } : data;
};

const requestWithBaseUrl = async (baseUrl, endpoint, config) => {
  const response = await fetch(`${baseUrl}${endpoint}`, config);
  const parsed = await parseResponse(response);
  preferredApiUrl = baseUrl;
  return parsed;
};

const requestAcrossCandidates = async (endpoint, config) => {
  const candidates = Array.from(new Set([preferredApiUrl, ...API_CANDIDATES]));
  let lastError = null;

  for (const baseUrl of candidates) {
    try {
      return await requestWithBaseUrl(baseUrl, endpoint, config);
    } catch (err) {
      // If server responded with 5xx, try next candidate; otherwise surface.
      if (err?.status && err.status !== 0) {
        if (err.status >= 500) {
          lastError = err;
          continue;
        }
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || {
    status: 0,
    message: "Cannot connect to server. Please check your internet connection.",
  };
};

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const headers = await buildHeaders({
      "Content-Type": "application/json",
    });

    const config = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(body);
    }

    return await requestAcrossCandidates(endpoint, config);
  } catch (err) {
    if (err?.status) {
      throw err;
    }

    throw {
      status: 0,
      message: "Cannot connect to server. Please check your internet connection.",
    };
  }
};

export const uploadMultipart = async (endpoint, formData, method = "POST") => {
  try {
    const headers = await buildHeaders();
    return await requestAcrossCandidates(endpoint, {
      method,
      headers,
      body: formData,
    });
  } catch (err) {
    if (err?.status) {
      throw err;
    }

    throw {
      status: 0,
      message: "Cannot connect to server. Please check your internet connection.",
    };
  }
};

export const saveAuthData = async (token, user) => {
  await AsyncStorage.setItem("authToken", token);
  await AsyncStorage.setItem("userToken", user.id);
  await AsyncStorage.setItem("userData", JSON.stringify(user));
};

export const saveStoredUser = async (user) => {
  await AsyncStorage.setItem("userData", JSON.stringify(user));
};

export const mergeStoredUser = async (patch) => {
  const current = await getStoredUser();
  const nextValue = { ...(current || {}), ...(patch || {}) };
  await saveStoredUser(nextValue);
  return nextValue;
};

export const clearAuthData = async () => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("userToken");
  await AsyncStorage.removeItem("userData");
};

export const getStoredUser = async () => {
  const userData = await AsyncStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};
