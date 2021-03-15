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

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
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
        p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email
          ) "owner"
      FROM post p
      INNER JOIN public.user u ON u.id = p."ownerId"
      ${cursor ? `WHERE p."createdAt" < $2` : ""}
      ORDER BY p."createdAt" DESC
      LIMIT $1
      `,
      queryArgs
    );

    const { userId } = req.session;
    const postResults = posts.slice(0, realLimit) as Array<Post>;
    const postsWithMeVote = await Promise.all(
      postResults.map(async (post) => {
        const vote = await Updoot.findOne({ userId, postId: post.id });
        return { ...post, meVote: vote?.value ?? 0 };
      })
    );

    return {
      posts: postsWithMeVote as Array<Post>,
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Post | undefined> {
    const res = await getConnection().query(
      `
      SELECT
        p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email
          ) "owner"
      FROM post p
      INNER JOIN public.user u ON u.id = p."ownerId"
      WHERE p.id = ${id}
      `
    );
    const post = res[0];
    if (!post) {
      return undefined;
    }
    const { userId } = req.session;
    const vote = await Updoot.findOne({ userId, postId: post.id });
    return { ...post, meVote: vote?.value ?? 0 };
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ownerId: req.session.userId, ...input }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne({ id });
    if (!post) {
      return undefined;
    }
    if (typeof title !== "undefined") {
      Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    try {
      await Post.delete({ id });
      return true;
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
}
