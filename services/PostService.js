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

export const fetchPosts = async (limit = 10, offset = 0, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(`
        *,
        user: users (id, name, image),
        postsLikes (*),
        comments (count)
        `)
        .range(offset, offset + limit - 1) // Fetch a range of posts using offset and limit
        .order("created_at", { ascending: false })
        .eq("userId", userId);

      if (error) {
        console.error("Error fetching posts: ", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(`
        *,
        user: users (id, name, image),
        postsLikes (*),
        comments (count)
        `)
        .range(offset, offset + limit - 1) // Fetch a range of posts using offset and limit
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts: ", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.log("Error fetching posts: ", error);
    return { success: false, error: error.message };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postsLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error("Post like error: ", error);
      return { success: false, error: 'Could not like post' };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Error fetching posts: ", error);
    return { success: false, error: error.message };
  }
};

export const deletePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postsLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId)


    if (error) {
      console.error("Could not remove like: ", error);
      return { success: false, error: 'Could not remove like' };
    }

    return { success: true };
  } catch (error) {
    console.log("Error fetching posts: ", error);
    return { success: false, error: error.message };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *, 
        user: users (id, name, image),
        postsLikes (*),
        comments (*, user: users(id, name, image))
      `)
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.error("Error fetching post: ", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Error fetching post: ", error);
    return { success: false, error: error.message };
  }
};

export const createComment = async (comment) => {
  try {

    const { data, error } = await supabase
      .from("comments")
      .insert({
        postId: comment.postId,
        userId: comment.userId,
        text: comment.comment
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error: ", error);
      return { success: false, error: error.message || 'Could not create comments' };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)


    if (error) {
      console.error("Could not delete comment: ", error);
      return { success: false, error: 'Could not delete comment' };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("Error deleting comment: ", error);
    return { success: false, error: error.message };
  }
};

export const deletePost = async (postId) => {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)

    if (error) {
      console.error("Could not delete post: ", error);
      return { success: false, error: 'Could not delete post' };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.log("Error deleting post: ", error);
    return { success: false, error: error.message };
  }

}