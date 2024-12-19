import React, { createContext, useState, useContext, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Create ThemeContext
const ThemeContext = createContext();

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to light theme

  // Load the saved theme when the app starts, depending on the platform
  useEffect(() => {
    const loadTheme = async () => {
      if (Platform.OS === "web") {
        const storedTheme = localStorage.getItem("theme"); // Fetch saved theme from localStorage for web
        if (storedTheme) {
          setTheme(storedTheme); // Set the theme if it exists
        }
      } else {
        const storedTheme = await SecureStore.getItemAsync("theme"); // Fetch saved theme from SecureStore for iOS/Android
        if (storedTheme) {
          setTheme(storedTheme); // Set the theme if it exists
        }
      }
    };

    loadTheme();
  }, []);

  // Save the theme when it changes, depending on the platform
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light"; // Toggle theme
    setTheme(newTheme); // Update theme state

    if (Platform.OS === "web") {
      localStorage.setItem("theme", newTheme); // Save the theme to localStorage for web
    } else {
      await SecureStore.setItemAsync("theme", newTheme); // Save the theme to SecureStore for iOS/Android
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access the theme context
export const useTheme = () => useContext(ThemeContext);
