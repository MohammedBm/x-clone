import { colorStyle } from "@/constants/Colors";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Text,
  Platform,
} from "react-native";

const RichTextEditor = ({ onChange, placeholder }) => {
  const [charCount, setCharCount] = useState(0); // Word count state
  const [text, setText] = useState(""); // State to hold the current input text
  const inputRef = useRef(null); // Reference to the TextInput for focusing

  const handleTextChange = (newText) => {
    const length = newText.length; // Get the length of the text
    if (length <= 360) {
      setText(newText); // Update the text state
      setCharCount(length); // Update the character count state
      onChange(newText); // Pass the text to the parent component
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          multiline
          style={styles.inputContainer}
          placeholder={placeholder}
          value={text} // Bind the TextInput value to the state
          onChangeText={handleTextChange} // Handle text change
          textAlignVertical="top"
        />
        <View style={styles.wordCountContainer}>
          <Text
            style={styles.wordCountText}
          >{`${charCount}/360 characters`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10, // Ensures space for word count
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 10, // Ensure content is scrollable
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colorStyle.primary,
    borderRadius: 10,
    padding: 10,
    minHeight: 200,
    maxHeight: 200, // Set the max height to 400
    textAlignVertical: "top",
    overflow: "auto", // Allow the text to scroll when it's too long
  },
  wordCountContainer: {
    padding: 5,
    alignItems: "flex-end",
  },
  wordCountText: {
    fontSize: 12,
    color: "#888",
  },
});
