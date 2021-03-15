import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { PostPoints } from "./PostPoints";
import NextLink from "next/link";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, title, textSnippet, createdAt, owner, points, meVote } = post;

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex align="center">
        <NextLink href={`/post/${id}`}>
          <Heading fontSize="xl" mr="2">
            {title}
          </Heading>
        </NextLink>
        <PostPoints postId={id} points={points} meVote={meVote} />
      </Flex>
      <Text fontSize="xs">
        {new Date(parseInt(createdAt)).toLocaleString()}
      </Text>
      <Text fontSize="xx-small"> Posted by {owner.username}</Text>
      <Text mt={4}>{textSnippet}</Text>
    </Box>
  );
};
