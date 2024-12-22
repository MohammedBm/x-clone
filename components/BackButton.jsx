import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { colorStyle, radius } from "@/constants/Colors";
import { ChevronLeft } from "lucide-react-native";

const BackButton = ({ size = 26, router }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <ChevronLeft size={size} strokeWidth={2.5} color={colorStyle.primary} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: radius.sm,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
  },
});
