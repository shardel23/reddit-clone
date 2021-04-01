import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];
  @Field()
  hasMore: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  createComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("content", () => String) content: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    const { userId } = req.session;
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

  @Query(() => PaginatedComments)
  async getComments(
    @Arg("postId", () => Int) postId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedComments> {
    const realLimit = Math.min(10, limit);
    const realLimitPlusOne = realLimit + 1;
    const queryArgs: any[] = [realLimitPlusOne];
    if (cursor) {
      queryArgs.push(new Date(parseInt(cursor) + 1));
    }
    const comments = await getConnection().query(
      `
      SELECT
        c.*
      FROM comment c
      WHERE c."postId" = ${postId}
      ${cursor ? `AND c."updatedAt" > $2` : ""}
      ORDER BY c."updatedAt" ASC
      LIMIT $1
      `,
      queryArgs
    );

    const commentResults = comments.slice(0, realLimit) as Array<Comment>;

    return {
      comments: commentResults as Array<Comment>,
      hasMore: comments.length === realLimitPlusOne,
    };
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("id", () => Int) id: number,
    @Arg("postId", () => Int) postId: number,
    @Arg("content", () => String) content: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ content })
      .where("id = :id and postId = :postId and ownerId = :ownerId", {
        id,
        postId,
        ownerId: parseInt(req.session.userId),
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }
}
