import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useRef } from "react";
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

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use useRef for input values
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");

  const backgroundColor = useThemeColor({}, "background");

  const onSubmit = async () => {
    // Get trimmed values from useRef
    const name = nameRef.current.trim();
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    // Check if any field is empty
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Failed to sign up",
        text2: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);

    // Sign up the user using Supabase Auth
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to sign up",
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Account created successfully",
      text2: "You can now login.",
    });
  };

  return (
    <ScreenWrapper bg={backgroundColor}>
      <ThemedView style={styles.container}>
        <BackButton router={router} />

        {/* welcome text */}
        <View>
          <ThemedText style={styles.welcomeText}>Hey!</ThemedText>
          <ThemedText
            style={[
              styles.welcomeText,
              { fontWeight: fonts.medium, fontSize: hp(3.5) },
            ]}
          >
            Let's get started!
          </ThemedText>
        </View>

        {/* form */}
        <View style={styles.form}>
          <ThemedText style={{ fontSize: hp(1.5) }}>
            Please fill in your details to create an account
          </ThemedText>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your name"
            onChangeText={(text) => (nameRef.current = text)} // Update ref value
            keyboardType="default"
          />
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(text) => (emailRef.current = text)} // Update ref value
            keyboardType="email-address"
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => (passwordRef.current = text)} // Update ref value
            keyboardType="default"
          />
          {/* button */}
          <Button title="Sign Up" loading={loading} onPress={onSubmit} />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?
          </ThemedText>
          <Pressable onPress={() => router.push("login")}>
            <ThemedText
              style={[
                styles.footerText,
                { color: colorStyle.primary, fontWeight: fonts.bold },
              ]}
            >
              Login
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScreenWrapper>
  );
};

export default Signup;

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
