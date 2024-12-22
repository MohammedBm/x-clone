import {
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import { formatDistanceToNowStrict, parseISO, set } from "date-fns";
import Icon from "@/assets/icons";
import { getSupabaseUrl } from "@/services/imageService";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { createPostLike, deletePostLike } from "@/services/PostService";
import { useRouter } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import alert from "./alert";

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcons = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  console.log(item);
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    setLikes(item?.postsLikes || []);
  }, []);

  const openDetails = () => {
    if (!showMoreIcons) return null;
    router.push({ pathname: "postDetails", params: { postId: item?.id } });
  };

  const formatTimeDifference = (timestamp) => {
    const date = parseISO(timestamp);

    // Get the time difference dynamically
    const timeDifference = formatDistanceToNowStrict(date, { addSuffix: true });

    return timeDifference;
  };

  const player = useVideoPlayer(getSupabaseUrl(item?.file), (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter(
        (like) => like.userId !== currentUser?.id
      );
      setLikes([...updatedLikes]);
      let res = await deletePostLike(item?.id, currentUser?.id);
      console.log("removed like", res);
      if (!res.success) {
        console.log("Error removing like: ", res.error);
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);

      if (!res.success) {
        console.log("Error liking post: ", res.error);
      }
    }
  };

  const handleDelete = () => {
    alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Delete",
        onPress: () => {
          onDelete(item);
        },
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

  const liked = likes?.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        {/* user info */}
        <View style={styles.userInfo}>
          <Avatar size={hp(4)} img={item?.user.image} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user.name}</Text>
            <Text style={styles.postTime}>
              {formatTimeDifference(item?.created_at)}
            </Text>
          </View>
        </View>
        {showMoreIcons && (
          <TouchableOpacity onPress={openDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.5)}
              strokeWidth={3}
              color={colorStyle.textDark}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Pencil size={20} color={colorStyle.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={20} color={colorStyle.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* posts body  */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          <Text style={{}}>{item?.body}</Text>
        </View>

        {/* image */}
        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={getSupabaseUrl(item?.file)}
            style={styles.postMedia}
            contentFit="scale-down"
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
          <TouchableOpacity onPress={onLike}>
            <Icon
              size={24}
              name="heart"
              fill={liked ? colorStyle.primary : "transparent"}
              color={liked ? colorStyle.primary : colorStyle.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openDetails}>
            <Icon name="comment" size={24} color={colorStyle.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item.commentCount || 0}</Text>
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
    backgroundColor: "black",
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
