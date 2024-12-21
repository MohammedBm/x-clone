import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Toast from "react-native-toast-message";
import { getUserData } from "@/services/userService";

const RootLayout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuth(session.user);
          updatedUserData(session.user, session?.user?.email);
          router.replace("/home");
        } else {
          setAuth(null);
          router.replace("/welcome");
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const updatedUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    } else {
      console.log(res.error);
    }
  };

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(main)/postDetails"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
};

export default RootLayout;
