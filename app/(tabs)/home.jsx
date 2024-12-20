import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { getUserImageSrc } from "@/services/imageService";

const Home = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user, setAuth } = useAuth();
  const router = useRouter();

  return (
    <ScreenWrapper bg={backgroundColor}>
      <View stylele={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Home</ThemedText>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                router.push("/notifications");
              }}
            >
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={colorStyle.primary}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={colorStyle.primary}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/profile");
              }}
            >
              <Avatar
                img={user?.avatar}
                size={hp(4.3)}
                rounded={radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: colorStyle.primary,
    fontSize: hp(3.2),
    fontWeight: fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: radius.sm,
    borderCurve: "continuous",
    borderColor: colorStyle.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2.2),
    textAlign: "center",
    color: colorStyle.primary,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: colorStyle.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.3),
    fontWeight: fonts.bold,
  },
});
