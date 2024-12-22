import { colorStyle } from "@/constants/Colors";
import { KeyboardOff } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";

const RichTextEditor = ({ onChange, placeholder, bodyRef }) => {
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

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.inputBorder}>
          <TextInput
            ref={inputRef}
            multiline
            style={styles.inputContainer}
            placeholder={placeholder}
            placeholderTextColor={colorStyle.textLight}
            value={text || bodyRef?.current || ""} // Use bodyRef for initial text value
            onChangeText={handleTextChange}
            textAlignVertical="top"
          />
        </View>
        {/* Keyboard close button */}
        {Platform.OS !== "web" && (
          <TouchableOpacity
            onPress={hideKeyboard}
            style={styles.keyboardCloseButton}
          >
            <KeyboardOff size={25} color={colorStyle.primary} />
          </TouchableOpacity>
        )}
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
    padding: 10,
    minHeight: 200,
    maxHeight: 200, // Set the max height to 400
    textAlignVertical: "top",
    overflow: "auto", // Allow the text to scroll when it's too long
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: colorStyle.primary,
    borderRadius: 10,
  },
  wordCountContainer: {
    padding: 5,
    alignItems: "flex-end",
  },
  wordCountText: {
    fontSize: 12,
    color: "#888",
  },
  keyboardCloseButton: {
    position: "absolute",
    right: 10,
    // sit at the bottom
    bottom: 40,
  },
});
