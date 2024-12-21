import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/PostService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

const POSTS_LIMIT = 10; // Number of posts per fetch

const Home = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePostEvents = async (payload) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const getPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    console.log(
      "Fetching posts with offset:",
      offset,
      "and limit:",
      POSTS_LIMIT
    );

    let res = await fetchPosts(POSTS_LIMIT, offset);
    if (res.success) {
      const newPosts = res.data;

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

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
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvents
      )
      .subscribe();

    return () => {
      supabase.removeSubscription(postChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg={backgroundColor}>
      <View style={styles.container}>
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
    paddingHorizontal: wp(4),
  },
});
