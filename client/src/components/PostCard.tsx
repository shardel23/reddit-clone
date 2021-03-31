import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostSnippetFragment, useMeQuery } from "../generated/graphql";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { PostPoints } from "./PostPoints";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    id,
    title,
    textSnippet,
    createdAt,
    owner,
    points,
    meVote,
    commentsCount,
  } = post;
  const [meQuery] = useMeQuery();

  return (
    <>
      <Box p={5} shadow="md" borderWidth="1px">
        <Flex align="center">
          <NextLink href={`/post/${id}`}>
            <Link>
              <Heading fontSize="xl" mr="2">
                {title}
              </Heading>
            </Link>
          </NextLink>
          <PostPoints postId={id} points={points} meVote={meVote} />
          {meQuery.data?.me?.id === owner.id ? (
            <Box ml="auto">
              <EditDeletePostButtons postId={id} />
            </Box>
          ) : null}
        </Flex>
        <Text fontSize="xs">
          {new Date(parseInt(createdAt)).toLocaleString()}
        </Text>
        <Text fontSize="xx-small"> Posted by {owner.username}</Text>
        <Text mt={4}>{textSnippet}</Text>
        {commentsCount > 0 ? (
          <NextLink href={`/post/${id}`}>
            <Link>
              <Text fontSize="xs" mt={3}>
                {commentsCount} comments
              </Text>
            </Link>
          </NextLink>
        ) : undefined}
      </Box>
    </>
  );
};
