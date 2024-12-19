import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, user, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // set auth
        setAuth(session.user); //
        updatedUserData(session?.user);
        // move to home
        router.replace("/home");
      } else {
        // auth to null
        setAuth(null);
        // move to welcome
        router.replace("welcome");
      }
    });
  }, []);

  const updatedUserData = async (user) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData(res.data);
  };

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </ThemeProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
