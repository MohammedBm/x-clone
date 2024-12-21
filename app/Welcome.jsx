import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { hp, wp } from "@/helpers/common";
import WelcomeSVG from "@/assets/images/WelcomeSVG";
import { Colors, colorStyle, fonts } from "@/constants/Colors";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/ThemeContext";

const Welcome = () => {
  const { theme } = useTheme();
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();
  // theme color
  return (
    <ScreenWrapper bg={backgroundColor}>
      <StatusBar style={theme === "light" ? "dark" : "dark"} />

      <ThemedView style={styles.container}>
        <WelcomeSVG
          style={styles.welcomeImage}
          height={wp(80)}
          width={wp(100)}
        />

        <ThemedView style={{ gap: 20 }}>
          <ThemedText type="title" style={styles.title}>
            Tech Community
          </ThemedText>
          <ThemedText
            type="subtitle"
            darkColor={Colors.dark.textSecondary}
            lightColor={Colors.light.textSecondary}
            style={styles.subTitle}
          >
            Connect with friends, share updates, and stay informed — all in one
            place
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <Button
            title="Get Started"
            buttonStyle={{
              marginHorizontal: wp(3),
            }}
            onPress={() => {
              router.push("signup");
            }}
          />
          <View style={styles.bottomTextContainer}>
            <ThemedText>Already have an account?</ThemedText>
            <Pressable
              onPress={() => {
                router.push("login");
              }}
            >
              <ThemedText style={styles.loginText}>Login!</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ThemedView>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: wp(4),
  },
  welcomeImage: {
    alignSelf: "center",
  },
  title: {
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: fonts.extraBold,
  },
  subTitle: {
    fontSize: hp(1.5),
    textAlign: "center",
    color: Colors.light.icon,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: colorStyle.primary,
    fontSize: hp(2),
    fontWeight: fonts.semiBold,
  },
});
