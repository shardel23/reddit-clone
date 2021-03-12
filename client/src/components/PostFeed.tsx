import { Center, Flex, Stack, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { usePostsQuery } from "../generated/graphql";
import { PostCard } from "./PostCard";
import VizSensor from "react-visibility-sensor";

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
          <VizSensor
            onChange={(isVisible) => {
              if (isVisible) {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }
            }}
          >
            <Center width="100%">
              <Spinner />
            </Center>
          </VizSensor>
        </Flex>
      ) : null}
    </>
  );
};
