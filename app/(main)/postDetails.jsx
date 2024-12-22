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
import {
  createComment,
  deleteComment,
  deletePost,
  fetchPostDetails,
} from "@/services/PostService";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { set } from "date-fns";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Toast from "react-native-toast-message";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const handleCommentChange = async (payload) => {
    console.log("Comment change", payload);
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prev) => {
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleCommentChange
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    try {
      let res = await fetchPostDetails(postId);
      if (res.success) {
        setPost(res.data);
      } else {
        console.error("Failed to fetch post details:", res.error);
      }
    } catch (error) {
      console.error("Error fetching post details:", error.message);
    }
    setStartLoading(false);
  };

  const onSendNewComment = async () => {
    // send comment
    if (!commentRef.current) return null;

    let data = {
      postId: post?.id,
      userId: user?.id,
      comment: commentRef.current,
    };

    setLoading(true);
    let res = await createComment(data);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "🚀 Comment sent",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "🚫 Error trying to send comment",
        text2: res.error,
      });
    }
  };

  const onDeleteComment = async (comment) => {
    console.log("Delete comment", comment);
    let res = await deleteComment(comment?.id);
    if (res.success) {
      setPost((prev) => {
        let newPost = { ...prev };
        newPost.comments = newPost.comments.filter((c) => c.id !== comment.id);
        return newPost;
      });
      Toast.show({
        type: "success",
        text1: "🚀 Comment deleted",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "🚫 Error trying to delete comment",
        text2: res.error,
      });
    }
  };

  const onDeletePost = async (item) => {
    let res = await deletePost(post?.id);
    if (res.success) {
      router.back();
      Toast.show({
        type: "success",
        text1: "🚀 Post deleted",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "🚫 Error trying to delete post",
        text2: res.error,
      });
    }
  };

  const onEditPost = async (item) => {
    router.back();
    router.push({ pathname: "newPost", params: { ...item } });
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        {Platform.OS === "web" && (
          <View style={{ marginHorizontal: wp(3) }}>
            <Header title={"Details"} />
          </View>
        )}
        <View
          style={{
            marginTop: hp(20),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.notFound}>Post not found</Text>
        </View>
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
          item={{ ...post, commentCount: post.comments.length }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcons={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
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
          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.sendIcon}
              onPress={onSendNewComment}
            >
              <Icon name={"send"} color={colorStyle.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* comments list */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((comment, index) => (
            <>
              <CommentItem
                key={index}
                item={comment}
                onDelete={onDeleteComment}
                canDelete={user.id == comment.userId || user.id == post.userId}
              />
              <View />
            </>
          ))}

          {
            // if no comments
            post?.comments?.length === 0 && (
              <Text
                style={{
                  color: colorStyle.textLight,
                  marginLeft: 5,
                }}
              >
                No comments yet
              </Text>
            )
          }
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
    paddingHorizontal: wp(2),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
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
