import { StyleSheet } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { colorStyle, radius } from "@/constants/Colors";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";

const Avatar = ({ img, size = hp(4.5), rounded = radius.md, style = {} }) => {
  return (
    <Image
      source={getUserImageSrc(img)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: colorStyle.darkLight,
    borderWidth: 1,
  },
});
