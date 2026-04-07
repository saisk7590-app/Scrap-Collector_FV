import React from "react";
import { Text } from "react-native";
import * as LucideIcons from "lucide-react-native";

/**
 * Returns a React component for the category icon.
 * Supports emojis and Lucide icon names.
 * 
 * @param {string} icon - The emoji or Lucide icon name (e.g., "🛞" or "Truck")
 * @param {number} size - Icon size
 * @param {string} color - Icon color (for Lucide icons)
 */
export const getCategoryIcon = (icon, size = 24, color = "#4B5563") => {
  if (!icon) return <Text style={{ fontSize: size }}>📦</Text>;

  // 1. Detect if it's an emoji
  // A simple regex for emojis (covers most common ones)
  const isEmoji = /\p{Extended_Pictographic}/u.test(icon);

  if (isEmoji) {
    return <Text style={{ fontSize: size }}>{icon}</Text>;
  }

  // 2. Handle Lucide Icons
  // Normalize to PascalCase (e.g., "file-text" -> "FileText")
  const pascalName = icon
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const IconComponent = LucideIcons[pascalName];

  if (IconComponent) {
    return <IconComponent size={size} color={color} />;
  }

  // 3. Fallback to rendering as text
  return <Text style={{ fontSize: size }}>{icon}</Text>;
};

import { API_URL } from "../src/lib/api";

const BACKEND_BASE = API_URL.replace("/api", ""); // e.g., http://localhost:5000

/**
 * Returns the image source for a scrap item.
 * Supports both remote URLs and backend-hosted item images in category subfolders.
 * 
 * @param {string} imageUrl - The filename (e.g. "newspaper.png") or a full URL
 * @param {string} categoryName - Optional category name (e.g. "PAPER") to find subfolders
 */
export const getItemImage = (imageUrl, categoryName) => {
  if (!imageUrl || imageUrl.trim() === "" || imageUrl === "null") {
    // Return backend-hosted placeholder
    return { uri: `${BACKEND_BASE}/uploads/items/placeholder.png` };
  }
  
  // If it's already a full URL, use it
  if (imageUrl.startsWith("http")) {
    return { uri: imageUrl };
  }

  // If the URL already contains a slash, assume it has a subfolder path
  if (imageUrl.includes("/")) {
    return { uri: `${BACKEND_BASE}/uploads/items/${imageUrl}` };
  }

  // Otherwise, use the category name to find the subfolder
  if (categoryName) {
    const cleanCategory = categoryName.trim();
    // Default to a folder with the category name (e.g., PAPER, Plastics)
    return { uri: `${BACKEND_BASE}/uploads/items/${cleanCategory}/${imageUrl}` };
  }

  // Fallback to the root uploads folder
  return { uri: `${BACKEND_BASE}/uploads/items/${imageUrl}` };
};
