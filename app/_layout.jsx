import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/hooks/ThemeContext";

const _layout = () => {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
