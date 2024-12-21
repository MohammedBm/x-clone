import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    // upload image or video
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName,
        post?.file?.uri, isImage
      )
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single()

    if (error) {
      console.error("Error creating post: ", error);
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error creating post: ", error);
    return {
      success: false, error: error.message
    }
  }
}

export const fetchPosts = async (limit = 10, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*, user: users (id, name, image)`)
      .range(offset, offset + limit - 1) // Fetch a range of posts using offset and limit
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts: ", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Error fetching posts: ", error);
    return { success: false, error: error.message };
  }
};
