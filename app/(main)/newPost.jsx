import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useThemeColor } from "@/hooks/useThemeColor";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { getSupabaseUrl } from "@/services/imageService";
import { Video } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import Toast from "react-native-toast-message";
import { createOrUpdatePost } from "@/services/PostService";

const NewPost = () => {
  const bgColor = useThemeColor({}, "background");
  const { user } = useAuth();

  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onPick = async (mediaType) => {
    let mediaConfig = {
      mediaTypes: mediaType ? ["images"] : ["videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    };

    try {
      let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

      if (!result.cancelled) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking media: ", error);
    }
  };

  const onPost = async () => {
    if (!bodyRef.current && !file) {
      Toast.show({
        type: "error",
        text1: "🚫 Post Cannot be empty",
      });
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user.id,
    };

    //  create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      router.back();
    } else {
      Toast.show({
        type: "error",
        text1: "🚫 Error",
        text2: res.error,
      });
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") return true;

    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    // check image or video for remote file
    if (file.includes("postImages")) return "image";

    return "video";
  };

  const getFileUri = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseUrl(file).uri;
  };

  const player = useVideoPlayer(getFileUri(file), (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <ScreenWrapper bg={bgColor}>
      <View style={styles.container}>
        <Header title="New Post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* avatar */}
          <View style={styles.header}>
            <Avatar img={user?.image} size={hp(6.5)} rounded={radius.xl} />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user && user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          {/* text editor */}
          <View style={styles.textEditor}>
            <RichTextEditor
              ref={editorRef}
              onChange={(body) => (bodyRef.current = body)}
              placeholder="What's on your mind?"
            />
          </View>

          {file && (
            <View style={styles.file}>
              {getFileType(file) === "video" ? (
                <VideoView
                  style={{ flex: 1 }}
                  player={player}
                  allowsFullscreen
                />
              ) : (
                <>
                  <Image
                    source={{ uri: getFileUri(file) }}
                    contentFit="cover"
                    style={{
                      flex: 1,
                    }}
                  />
                </>
              )}

              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          )}

          {/* media */}
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your Post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={colorStyle.textLight} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={colorStyle.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6) }}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onPost}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: fonts.semiBold,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2),
    fontWeight: fonts.semiBold,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: fonts.medium,
    color: colorStyle.textLight,
  },
  textEditor: {
    marginTop: 10,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: radius.xl,
    borderColor: colorStyle.primary,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(2),
    fontWeight: fonts.semiBold,
  },
  imageIcon: {
    borderRadius: radius.md,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: radius.xl,
    overflow: "hidden",
  },
  video: {},
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.5)",
    // shadowColor: colorStyle.textLight,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
});
