import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { PostPoints } from "../../components/PostPoints";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post: NextPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;
  if (!postId) {
    return <div>No post ID</div>;
  }
  const [{ data, fetching }] = usePostQuery({
    variables: { id: parseInt(postId) },
  });

  let body = <></>;
  if (fetching) {
    body = <div>Loading</div>;
  } else if (!data?.post) {
    body = <div>Error</div>;
  } else {
    const { id, title, text, owner, points, meVote, createdAt } = data.post;
    body = (
      <Box p={10} shadow="md" borderWidth="1px">
        <Flex align="center">
          <Heading fontSize="xl" mr="2">
            {title}
          </Heading>
          <PostPoints postId={id} points={points} meVote={meVote} />
        </Flex>
        <Text fontSize="small"> Posted by {owner.username}</Text>
        <Text fontSize="xs">
          {new Date(parseInt(createdAt)).toLocaleString()}
        </Text>
        <Text mt={4}>{text}</Text>
      </Box>
    );
  }

  return <Layout variant="regular">{body}</Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
