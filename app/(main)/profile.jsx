import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { colorStyle, radius } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { ThemedText } from "@/components/ThemedText";

const Profile = () => {
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();
  const { user, setAuth } = useAuth();

  const logOutHandler = async () => {
    setAuth(null);

    const { error } = await supabase.auth.signOut();

    console.log("error", error);
  };

  return (
    <ScreenWrapper bg={backgroundColor}>
      <UserHeader router={router} user={user} logoutHandler={logOutHandler} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, logoutHandler }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" router={router} mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
          <Icon name="logout" color={colorStyle.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              img={user?.image}
              size={hp(12)}
              rounded={radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("/editProfile")}
            >
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>
          {/* username and details */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <ThemedText style={styles.userName}>{user && user.name}</ThemedText>
            <ThemedText style={styles.infoText}>
              {(user && user.address) || "No address"}
            </ThemedText>
          </View>

          {/* email, phone, bio */}
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={colorStyle.textLight} />
              <ThemedText style={styles.infoText}>
                {(user && user.email) || "No email"}
              </ThemedText>
            </View>
            <View style={styles.info}>
              <Icon name="call" size={20} color={colorStyle.textLight} />
              <ThemedText style={styles.infoText}>
                {(user && user.phoneNumber) || "No Phone number"}
              </ThemedText>
            </View>
            <View style={styles.info}>
              <ThemedText style={styles.infoText}>
                {(user && user.bio) || "No bio found"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: colorStyle.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: colorStyle.textLight,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: radius.sm,
    backgroundColor: "$feee2e2",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2.2),
    textAlign: "center",
    color: colorStyle.primary,
  },
});
