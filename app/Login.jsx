import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import Home from "@/assets/icons/Home";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/ThemeContext";
import { colorStyle, fonts } from "@/constants/Colors";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemedView } from "@/components/ThemedView";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";

const Login = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <ScreenWrapper bg={backgroundColor}>
      <ThemedView style={styles.container}>
        <BackButton router={router} />

        {/* welcome text */}
        <View>
          <ThemedText style={styles.welcomeText}>Hey!,</ThemedText>
          <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
        </View>

        {/* form */}
        <Text style={styles.text}>sss</Text>
      </ThemedView>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontWeight: fonts.bold,
    fontSize: hp(4),
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: fonts.semiBold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    fontsize: hp(2),
  },
});
