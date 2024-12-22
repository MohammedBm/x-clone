import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/PostService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { SquarePlus } from "lucide-react-native";

const POSTS_LIMIT = 10; // Number of posts per fetch

const Home = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle post events (Insert, Update, Delete)
  const handlePostEvents = async (payload) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);

      newPost.user = res.success ? res.data : {};
      newPost.comments = [];
      newPost.postLikes = [];
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
    if (payload.eventType === "DELETE") {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id)
      );
    }

    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPosts((prev) => {
        let updatedPost = prev.map((post) => {
          if (post.id === payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });

        return updatedPost;
      });
    }
  };

  // Handle comment events (Insert)
  const handleCommentEvents = (payload) => {
    if (payload?.new?.postId) {
      const postId = payload.new.postId;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
    }
  };

  // Handle like events (Insert, Update, Delete)
  const handleLikeEvents = async (payload) => {
    if (payload?.new?.postId) {
      const postId = payload.new.postId;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likeCount: (post.likeCount || 0) + 1 } // Increment like count
            : post
        )
      );
    }
  };

  // Fetch posts from the server
  const getPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let res = await fetchPosts(POSTS_LIMIT, offset);
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

  useEffect(() => {
    // Subscribe to posts table
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvents
      )
      .subscribe();

    // Subscribe to comments table
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        handleCommentEvents
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg={backgroundColor}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Home</ThemedText>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/newPost")}>
              <SquarePlus size={28} color={colorStyle.primary} />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/profile");
              }}
            >
              <Avatar
                img={user?.image}
                size={hp(4.3)}
                rounded={radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* POSTS */}
        <View style={styles.listContainer}>
          <FlatList
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderColor: colorStyle.gray,
                  borderBottomWidth: 1,
                }}
              />
            )}
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PostCard item={item} currentUser={user} router={router} />
            )}
            contentContainerStyle={styles.listStyle}
            onEndReached={getPosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMore ? (
                <Loading />
              ) : (
                <ThemedText style={{ textAlign: "center", padding: 10 }}>
                  No more posts to show
                </ThemedText>
              )
            }
          />
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
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  listContainer: {
    flex: 1,
    overflow: "hidden",
  },
  listStyle: {
    paddingTop: 20,
  },
});
