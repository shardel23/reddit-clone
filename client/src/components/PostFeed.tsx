import { Button, Flex, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { usePostsQuery } from "../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";
import { PostCard } from "./PostCard";

interface PostFeedProps {}

export const PostFeed: React.FC<PostFeedProps> = ({}) => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div> No posts to show </div>;
  }

  return (
    <>
      {!data && fetching ? (
        <div> Loading... </div>
      ) : (
        <Stack spacing={6}>
          {data!.posts.posts.map((post) => (
            <PostCard
              postId={post.id}
              title={post.title}
              body={post.textSnippet}
              createdAt={post.createdAt}
              owner={post.owner.username}
              points={post.points}
              key={post.id}
            />
          ))}
        </Stack>
      )}
      <br />
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            colorScheme={BUTTON_COLOR_SCHEME}
            m="auto"
            my={8}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </>
  );
};
