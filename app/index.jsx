import React from "react";
import { StyleSheet, Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { useTheme } from "@/hooks/ThemeContext";

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Hello, world!</ThemedText>
      <Button title="To Welcome" onPress={() => router.push("Welcome")} />
      <Button
        title={`Current Theme: ${theme}. Toggle Theme`}
        onPress={toggleTheme}
      />
    </ThemedView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    color: "red",
  },
});
