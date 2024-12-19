import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import { hp } from "@/helpers/common";
import Loading from "./Loading";

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
}) => {
  const shadowStyle = {
    shadowColor: colorStyle.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <ThemedView
        style={[styles.button, buttonStyle, { backgroundColor: "transparent" }]}
      >
        <Loading />
      </ThemedView>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <ThemedText lightColor={"white"} style={[styles.text, textStyle]}>
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colorStyle.primary,
    height: hp(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.xl,
  },
  text: {
    fontSize: hp(2.5),
    fontWeight: fonts.bold,
  },
});
// 27
