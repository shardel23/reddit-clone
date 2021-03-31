import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  createComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("userId", () => Int) userId: number,
    @Arg("content", () => String) content: string,
    @Ctx() {}: MyContext
  ): Promise<Comment> {
    return Comment.create({ postId, ownerId: userId, content }).save();
  }

  @FieldResolver(() => User)
  owner(
    @Root() { ownerId }: Comment,
    @Ctx() { userLoader }: MyContext
  ): Promise<User> {
    return userLoader.load(ownerId);
  }

  @FieldResolver(() => User)
  post(
    @Root() { postId }: Comment,
    @Ctx() { postLoader }: MyContext
  ): Promise<Post> {
    return postLoader.load(postId);
  }

  @Query(() => Comment, { nullable: true })
  getComment(
    @Arg("id", () => Int) id: number,
    @Arg("postId", () => Int) postId: number,
    @Arg("userId", () => Int) userId: number
  ): Promise<Comment | undefined> {
    return Comment.findOne({ id, postId, ownerId: userId });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const res = await Comment.delete({
        id,
        postId,
        ownerId: parseInt(req.session.userId),
      });
      return res.affected === 1 ? true : false;
    } catch (e) {
      return false;
    }
  }
}
