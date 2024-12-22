import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { colorStyle, radius } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { fetchPosts } from "@/services/PostService";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";

const POSTS_LIMIT = 10;

const ViewProfile = () => {
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();
  const { userId } = useLocalSearchParams(); // Get the userId from the query params
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        console.log("Fetched user data:", data); // Debugging line
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(data);
        }
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // Modify the query to filter posts by userId
    let res = await fetchPosts(POSTS_LIMIT, offset, userId); // Pass userId here

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

    setLoading(false);
  };

  if (!userId || !user) {
    return (
      <View style={{ flex: 1, marginTop: hp(25), alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  return (
    <ScreenWrapper bg={backgroundColor}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{ borderBottomWidth: 1, borderColor: colorStyle.gray }}
          />
        )}
        ListHeaderComponent={<UserHeader user={user} />}
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        contentContainerStyle={styles.listStyle}
        onEndReached={getPosts}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length === 0 ? 100 : 30 }}>
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

const UserHeader = ({ user }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <Header title="Profile" mb={30} />
      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              img={user?.image}
              size={hp(12)}
              rounded={radius.xxl * 1.4}
            />
          </View>
          <View style={{ alignItems: "center", gap: 4 }}>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <ThemedText style={styles.infoText}>
              {user?.address || "No address"}
            </ThemedText>
          </View>
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <ThemedText style={styles.infoText}>
                {user?.phoneNumber || "No Phone number"}
              </ThemedText>
            </View>
            <View style={styles.info}>
              <ThemedText style={styles.infoText}>
                {user?.bio || "No bio found"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
  },
  infoContainer: {
    marginHorizontal: 10,
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
  listStyle: {
    paddingBottom: 30,
  },
});

export default ViewProfile;
