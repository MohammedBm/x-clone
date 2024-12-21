import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { fetchPostDetails } from "@/services/PostService";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { set } from "date-fns";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId);
    if (res.success) {
      setPost(res.data);
    }
    setStartLoading(false);
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {Platform.OS === "web" && (
        <View style={{ marginHorizontal: wp(3) }}>
          <Header title={"Details"} />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcons={false}
        />
        {/* comments input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Add a comment....."
            placeholderTextColor={colorStyle.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderColor: colorStyle.primary,
              borderRadius: radius.xl,
            }}
            onChangeText={(text) => (commentRef.current = text)}
          />
          <TouchableOpacity style={styles.sendIcon}>
            <Icon name={"send"} color={colorStyle.primaryDark} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(5),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: colorStyle.primary,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    height: hp(6.2),
    width: hp(6.2),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: hp(3),
    color: colorStyle.text,
    fontWeight: fonts.bold,
  },
  loading: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.5 }],
  },
});
