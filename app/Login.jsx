import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
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
import Input from "@/components/Input";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();

  // Declare refs for email and password
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const onSubmit = async () => {
    // Trim the values first before checking if they are empty
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    // Validation check
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Failed to login",
        text2: "Please fill all the fields! 👋",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(error);
    setLoading(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to login",
        text2: error.message,
      });
      setLoading(false);
      return;
    }

    Toast.show({
      type: "success",
      text1: "Login successful",
      text2: "Welcome back! 🎉",
    });
  };

  return (
    <ScreenWrapper bg={backgroundColor}>
      <ThemedView style={styles.container}>
        <BackButton router={router} />

        {/* welcome text */}
        <View>
          <ThemedText style={styles.welcomeText}>Hey!,</ThemedText>
          <ThemedText
            style={[
              styles.welcomeText,
              { fontWeight: fonts.medium, fontSize: hp(3.5) },
            ]}
          >
            Good to see you back!
          </ThemedText>
        </View>

        {/* form */}
        <View style={styles.form}>
          <ThemedText style={{ fontSize: hp(1.5) }}>
            Please login to your account to continue using our {"\n"}services
          </ThemedText>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(text) => (emailRef.current = text)} // Update email ref correctly
            keyboardType="email-address"
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => (passwordRef.current = text)} // Update password ref correctly
            keyboardType="default"
          />
          <ThemedText style={styles.forgotPassword}>
            Forgot password?
          </ThemedText>

          {/* button */}
          <Button title="Login" loading={loading} onPress={onSubmit} />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Don't have an account?
          </ThemedText>
          <Pressable onPress={() => router.push("signup")}>
            <ThemedText
              style={[
                styles.footerText,
                { color: colorStyle.primary, fontWeight: fonts.bold },
              ]}
            >
              Sign up
            </ThemedText>
          </Pressable>
        </View>
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
    fontSize: hp(2),
  },
});
