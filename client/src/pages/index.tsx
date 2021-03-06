import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Button, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { PostCard } from "../components/PostCard";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <Layout>
        <div> No posts to show </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="create-post">
          <Link ml="auto"> Create new post </Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div> Loading... </div>
      ) : (
        <Stack spacing={6}>
          {data!.posts.posts.map((post) => (
            <PostCard
              title={post.title}
              body={post.textSnippet}
              createdAt={post.createdAt}
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
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
