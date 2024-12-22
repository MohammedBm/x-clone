import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { colorStyle } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";

const Loading = ({ size = "large", color = colorStyle.primary }) => {
  return (
    <ThemedView style={styles.loading}>
      <ActivityIndicator size={size} color={color} />
    </ThemedView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loading: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
