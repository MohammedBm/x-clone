import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Colors, colorStyle, radius } from "@/constants/Colors";
import { hp } from "@/helpers/common";
import { useTheme } from "@/hooks/ThemeContext";

const Input = (props) => {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{
          flex: 1,
          color: theme === "light" ? Colors.light.text : Colors.dark.text,
        }}
        placeholderTextColor={Colors.light.textSecondary}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.6,
    borderRadius: radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
    borderColor: colorStyle.primary,
  },
});
