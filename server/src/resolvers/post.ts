import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";

@InputType()
export class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() { text }: Post) {
    if (text.length <= 50) {
      return text;
    }
    return text.slice(0, 50).concat("...");
  }

  @FieldResolver(() => User)
  owner(
    @Root() { ownerId }: Post,
    @Ctx() { userLoader }: MyContext
  ): Promise<User> {
    console.log("PostOwner");
    return userLoader.load(ownerId);
  }

  @FieldResolver(() => Int)
  meVote(
    @Root() { id }: Post,
    @Ctx() { req, voteLoader }: MyContext
  ): Promise<number> {
    const { userId } = req.session;
    return voteLoader.load({ postId: id, userId });
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const queryArgs: any[] = [realLimitPlusOne];
    if (cursor) {
      queryArgs.push(new Date(parseInt(cursor)));
    }
    const posts = await getConnection().query(
      `
      SELECT
        p.*
      FROM post p
      ${cursor ? `WHERE p."createdAt" < $2` : ""}
      ORDER BY p."createdAt" DESC
      LIMIT $1
      `,
      queryArgs
    );

    const postResults = posts.slice(0, realLimit) as Array<Post>;

    return {
      posts: postResults as Array<Post>,
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ownerId: req.session.userId, ...input }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where("id = :id and ownerId = :ownerId", {
        id,
        ownerId: parseInt(req.session.userId),
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const res = await Post.delete({
        id,
        ownerId: parseInt(req.session.userId),
      });
      return res.affected === 1 ? true : false;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ): Promise<number> {
    const { userId } = req.session;
    const isCancelVote = value === 0;
    const isUpvote = value > 0;
    const isDownvote = !isCancelVote && !isUpvote;
    const pointValue = isUpvote ? 1 : isDownvote ? -1 : 0;
    const vote = await Updoot.findOne({ userId, postId });
    if (vote) {
      const currentValue = vote.value;
      if (currentValue === pointValue) {
        return currentValue;
      }
      await getConnection().query(
        `
        START TRANSACTION;
        UPDATE
          updoot
        SET
          value = ${pointValue}
        WHERE
          "userId" = ${userId} AND
          "postId" = ${postId};
        UPDATE
          post
        SET
          points = points + ${
            isCancelVote
              ? -1 * currentValue
              : currentValue === 0
              ? pointValue
              : pointValue * 2
          }
        WHERE
          id = ${postId};
        COMMIT;
        `
      );
      const post = await Post.findOne(postId);
      return post!.points;
    }
    await getConnection().query(
      `
      START TRANSACTION;
      INSERT INTO updoot
        ("userId", "postId", value)
      VALUES
        (${userId}, ${postId}, ${pointValue});
      UPDATE
        post
      SET
        points = points + ${pointValue}
      WHERE
        id = ${postId};
      COMMIT;
      `
    );
    const post = await Post.findOne(postId);
    return post!.points;
  }

  @FieldResolver(() => [Comment])
  comments(@Root() { id }: Post): Promise<Comment[]> {
    return Comment.find({ where: { postId: id } });
  }

  @FieldResolver(() => Int)
  async commentsCount(@Root() { id }: Post): Promise<number> {
    const [, commentsCount] = await Comment.findAndCount({
      where: { postId: id },
    });
    return commentsCount;
  }
}
