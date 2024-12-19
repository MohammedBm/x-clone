import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user, setAuth } = useAuth();

  console.log("user", user);

  const logOutHandler = async () => {
    setAuth(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenWrapper bg={backgroundColor}>
      <ThemedText>Home</ThemedText>
      <Button title="Logout" onPress={logOutHandler} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
