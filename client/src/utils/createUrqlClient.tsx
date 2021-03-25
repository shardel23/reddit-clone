import {
  Cache,
  cacheExchange,
  Data,
  ResolveInfo,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  VoteMutation,
  DeletePostMutationVariables,
  DeletePostMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { gql } from "@urql/core";
import { isServer } from "./isServer";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

const invalidatePostsCache = (
  _result: Data,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  const allFields = cache.inspectFields("Query");
  const postsQueries = allFields.filter((field) => field.fieldName === "posts");
  postsQueries.map((postsQuery) => {
    cache.invalidate("Query", "posts", postsQuery.arguments as Variables);
  });
};

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const queryHasMore = cache.resolve(key, "hasMore") as boolean;
      if (!queryHasMore) {
        hasMore = queryHasMore;
      }
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange, ctx) => {
  let cookie = "";
  if (isServer() && ctx) {
    cookie = ctx.req.headers.cookie;
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
          User: () => null,
          PostAndVote: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (result, args, cache, _info) => {
              if ((result as DeletePostMutation).deletePost) {
                cache.invalidate({
                  __typename: "Post",
                  id: (args as DeletePostMutationVariables).id,
                });
              }
            },
            createPost: invalidatePostsCache,
            vote: (result, args, cache, _info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _read on Post {
                    id
                  }
                `,
                { id: postId }
              );
              if (data) {
                const newPoints = (result as VoteMutation).vote;
                cache.writeFragment(
                  gql`
                    fragment _write on Post {
                      points
                      meVote
                    }
                  `,
                  { id: postId, points: newPoints, meVote: value }
                );
              }
            },
            logout: (result, args, cache, info) => {
              invalidatePostsCache(result, args, cache, info);
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                () => ({
                  me: null,
                })
              );
            },
            login: (result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  }
                  return {
                    me: result.login.user,
                  };
                }
              );
              invalidatePostsCache(result, args, cache, info);
            },
            register: (_result, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  }
                  return {
                    me: result.register.user,
                  };
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
