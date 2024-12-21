import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import {
  formatDistanceToNowStrict,
  formatDistanceStrict,
  parseISO,
} from "date-fns";
import Icon from "@/assets/icons";
import { getSupabaseUrl } from "@/services/imageService";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6.5,
    elevation: 1,
  };

  const formatTimeDifference = (timestamp) => {
    const date = parseISO(timestamp);

    // Get the time difference dynamically
    const timeDifference = formatDistanceToNowStrict(date, { addSuffix: true });

    return timeDifference;
  };

  const player = useVideoPlayer(getSupabaseUrl(item.file), (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const liked = true;
  const likes = [];
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info */}
        <View style={styles.userInfo}>
          <Avatar size={hp(4)} img={item.user.image} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item.user.name}</Text>
            <Text style={styles.postTime}>
              {formatTimeDifference(item.created_at)}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.5)}
            strokeWidth={3}
            color={colorStyle.textDark}
          />
        </TouchableOpacity>
      </View>
      {/* posts body  */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          <Text style={{}}>{item.body}</Text>
        </View>

        {/* image */}
        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={getSupabaseUrl(item.file)}
            style={styles.postMedia}
            content="cover"
          />
        )}

        {/* video */}
        {item?.file && item?.file?.includes("postVideos") && (
          <VideoView
            style={[
              styles.postMedia,
              { backgroundColor: "black", height: hp(30) },
            ]}
            player={player}
            allowsFullscreen
            startsPictureInPictureAutomatically={false}
          />
        )}
      </View>
      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name="heart"
              size={24}
              fill={liked ? colorStyle.primary : "transparent"}
              color={liked ? colorStyle.primary : colorStyle.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="comment" size={24} color={colorStyle.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="share" size={24} color={colorStyle.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: colorStyle.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: colorStyle.textDark,
    fontWeight: fonts.medium,
  },
  postTime: {
    fontSize: hp(1.5),
    color: colorStyle.textLight,
    fontWeight: fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  count: {
    color: colorStyle.textLight,
    fontSize: hp(1.8),
  },
});
