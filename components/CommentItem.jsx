import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colorStyle, fonts, radius } from "@/constants/Colors";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import { formatDistanceToNowStrict, parseISO, set } from "date-fns";
import { Trash2 } from "lucide-react-native";
import alert from "./alert";

const CommentItem = ({ item, canDelete = false, onDelete = () => {} }) => {
  const formatTimeDifference = (timestamp) => {
    const date = parseISO(timestamp);

    // Get the time difference dynamically
    const timeDifference = formatDistanceToNowStrict(date, { addSuffix: true });

    return timeDifference;
  };

  const handleDeleteComment = () => {
    alert("Delete Comment", "Are you sure you want to delete this comment?", [
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
  return (
    <View style={styles.container}>
      <Avatar img={item?.user?.image} />
      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text>•</Text>
            <Text style={{ color: colorStyle.textLight, fontSize: hp(1.4) }}>
              {formatTimeDifference(item?.created_at)}
            </Text>
          </View>

          {canDelete && (
            <TouchableOpacity onPress={handleDeleteComment}>
              <Trash2 size={16} color={colorStyle.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderCurve: "continuous",
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "white",
    borderColor: colorStyle.dark,
    shadowColor: colorStyle.dark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: fonts.medium,
    color: colorStyle.textDark,
  },
});
