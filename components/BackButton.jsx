import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "@/assets/icons";
import { colorStyle, radius } from "@/constants/Colors";

const BackButton = ({ size = 26, router }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon
        name="arrowLeft"
        strokeWidth={2.5}
        size={size}
        color={colorStyle.primary}
      />
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
