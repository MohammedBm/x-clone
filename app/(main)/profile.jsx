import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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
import alert from "@/components/alert";
import { fetchPosts } from "@/services/PostService";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";

const POSTS_LIMIT = 10; // Ensure posts limit is defined
let LIMIT = 0;

const Profile = () => {
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [offset, setOffset] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setAuth(null);

    const { error } = await supabase.auth.signOut();

    console.log("error", error);
  };

  const handleLogout = () => {
    alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Delete",
        onPress: logout,
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => {
          console.log("Cancel delete");
        },
        style: "cancel",
      },
    ]);
  };

  const getPosts = async () => {
    if (loading || !hasMore) return; // Avoid duplicate calls when already loading or no more posts
    setLoading(true); // Start loading state

    try {
      let res = await fetchPosts(POSTS_LIMIT, offset, user.id);
      if (res.success) {
        const newPosts = res.data;
        if (newPosts.length > 0) {
          // For each post, fetch the comment count directly from the `comments` table
          const postsWithCommentCounts = await Promise.all(
            newPosts.map(async (post) => {
              const { data: commentCountData, error } = await supabase
                .from("comments")
                .select("count")
                .eq("postId", post.id)
                .single();

              if (error) {
                console.error("Error fetching comment count:", error);
                post.commentCount = 0;
              } else {
                post.commentCount = commentCountData?.count || 0;
              }
              return post;
            })
          );
          setPosts((prevPosts) => [...prevPosts, ...postsWithCommentCounts]);
          setOffset((prevOffset) => prevOffset + POSTS_LIMIT);
        }
        if (newPosts.length < POSTS_LIMIT) {
          setHasMore(false);
        }
      } else {
        console.error("Error fetching posts:", res.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // Always reset loading state, even in case of error
    }
  };

  console.log("posts", posts);

  return (
    <ScreenWrapper bg={backgroundColor}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{ borderBottomWidth: 1, borderColor: colorStyle.gray }}
          />
        )}
        ListHeaderComponent={
          <UserHeader
            router={router}
            user={user}
            logoutHandler={handleLogout}
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        contentContainerStyle={styles.listStyle}
        onEndReached={getPosts}
        onEndReachedThreshold={0.3} // Trigger earlier when nearing the bottom
        ListFooterComponent={
          hasMore ? (
            <View
              style={{
                marginVertical: posts.length == 0 ? 100 : 30,
              }}
            >
              <Loading />
            </View>
          ) : (
            <ThemedText style={{ textAlign: "center", padding: 10 }}>
              No more posts to show
            </ThemedText>
          )
        }
      />
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
    backgroundColor: "#fee2e2",
  },
  listStyle: {
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2.2),
    textAlign: "center",
    color: colorStyle.primary,
  },
});
