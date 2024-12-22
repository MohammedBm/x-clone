import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "@/helpers/common";
import { colorStyle, radius } from "@/constants/Colors";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { useAuth } from "@/context/AuthContext";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { updateUserData } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Camera, MapPin, Phone, UserRound } from "lucide-react-native";

const EditProfile = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user: currentUser, setUserData } = useAuth();
  const [user, setUser] = useState({
    name: "",
    bio: "",
    image: null,
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name,
        bio: currentUser.bio,
        image: currentUser.image,
        phoneNumber: currentUser.phoneNumber,
        address: currentUser.address,
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, bio, phoneNumber, address, image } = userData;
    if (!name || !bio || !phoneNumber || !address || !image) {
      Toast.show({
        type: "error",
        text1: "🔥 Error",
        text2: "All fields are required",
      });
      return;
    }
    setLoading(true);

    if (typeof image == "object") {
      let imageRes = await uploadFile("profiles", image?.uri);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    const res = await updateUserData(currentUser?.id, userData);
    setLoading(false);
    Toast.show({
      type: res.success ? "success" : "error",
      text1: res.success ? "🚀 Success" : "🔥 Error",
      text2: res.success ? "Profile updated successfully" : res.msg,
    });

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSrc(currentUser?.image);

  return (
    <ScreenWrapper bg={backgroundColor}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Camera
                  size={20}
                  strokeWidth={2.5}
                  color={colorStyle.primary}
                />
              </Pressable>
            </View>

            <Text style={{ fontSize: hp(1.5) }}>
              Fill in the form below to update your profile
            </Text>
            <Input
              icon={
                <UserRound
                  size={20}
                  strokeWidth={2.5}
                  color={colorStyle.primary}
                />
              }
              placeholder="Full Name"
              onChangeText={(text) => setUser({ ...user, name: text })}
              value={user.name}
            />
            <Input
              icon={
                <Phone size={20} strokeWidth={2.5} color={colorStyle.primary} />
              }
              placeholder="Enter your phone number"
              onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
              value={user.phoneNumber}
              keyboardType="phone-pad"
            />

            <Input
              icon={
                <MapPin
                  size={20}
                  strokeWidth={2.5}
                  color={colorStyle.primary}
                />
              }
              placeholder="Enter your address"
              onChangeText={(text) => setUser({ ...user, address: text })}
              value={user.address}
            />
            <Input
              placeholder="Enter your bio"
              onChangeText={(text) => setUser({ ...user, bio: text })}
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
            />

            <Button
              title="Update Profile"
              loading={loading}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: radius.xxl * 1.4,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colorStyle.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: colorStyle.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
  },
  form: {
    gap: 10,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: colorStyle.primary,
    borderRadius: radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
