import DataLoader from "dataloader";
import { Post } from "../../entities/Post";

export const createPostLoader = () =>
  new DataLoader<number, Post>(async (postIds) => {
    const posts = await Post.findByIds(postIds as number[]);

    const postIdToPost: Record<number, Post> = {};
    posts.forEach((u) => {
      postIdToPost[u.id] = u;
    });

    return postIds.map((postId) => postIdToPost[postId]);
  });
