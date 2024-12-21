import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

export const getUserImageSrc = imagePath => {
  if (imagePath) {
    return getSupabaseUrl(imagePath)
  } else {
    return require("@/assets/images/defaultUser.png")
  }
}

export const getSupabaseUrl = (filePath) => {
  if (filePath) {
    return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`
  } else {
    return null;
  }
}

export const uploadFile = async (folder, fileUri, isImage = true) => {
  try {
    // Generate the file path
    const fileName = getFilePath(folder, isImage);

    // Read file data (Platform-specific handling)
    let fileBase64;
    if (Platform.OS === 'web') {
      fileBase64 = await readFileAsBase64(fileUri);
    } else {
      fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    // Convert Base64 to binary for upload
    const imageData = decode(fileBase64);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, imageData, {
        contentType: isImage ? 'image/*' : 'video/*',
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      console.error('File upload error:', error);
      return { success: false, msg: 'File upload failed' };
    }

    return { success: true, data: data.path };

  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, msg: 'File upload failed' };
  }
};

// Helper function for web: Read file as Base64
const readFileAsBase64 = async (fileUri) => {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract Base64 part
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Generate file path
export const getFilePath = (folder, isImage) => {
  const extension = isImage ? '.png' : '.mp4';
  const timestamp = new Date().toISOString();
  return `${folder}/${timestamp}${extension}`;
};
