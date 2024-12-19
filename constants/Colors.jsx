/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#E1E8EB", // Lighter gray text, similar to Twitter
    textSecondary: "#AAB8C2", // A bit lighter for secondary text
    background: "#15202B", // A grayish dark blue, not pure black
    tint: tintColorDark, // Keep as is for consistency
    icon: "#AAB8C2", // Match the textSecondary color
    tabIconDefault: "#AAB8C2", // Lighter default tab icon
    tabIconSelected: tintColorDark, // Same as original tint color for selected state
  },
};

export const fonts = {
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
};

export const colorStyle = {
  primary: "#1DA1F2",
  primaryDark: "#00AC62",
  dark: "#3E3E3E",
  darkLight: "#E1E1E1",
  gray: "#e3e3e3",
  text: "#494949",
  textLight: "#7C7C7C",
  textDark: "#1D1D1D",
  rose: "#ef4444",
  roseLight: "#f87171",
};

export const radius = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
};
