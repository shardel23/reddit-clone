import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, title, textSnippet, createdAt, owner, points, meVote } = post;
  const [, voteMutation] = useVoteMutation();

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex align="center">
        <Heading fontSize="xl" mr="2">
          {title}
        </Heading>
        <Text fontSize="sm" mr="2">
          {points}
        </Text>
        <ArrowUpIcon
          color={meVote > 0 ? "green.500" : ""}
          onClick={async () => {
            const newVote = meVote > 0 ? 0 : 1;
            await voteMutation({ postId: id, value: newVote });
          }}
        />
        <ArrowDownIcon
          color={meVote < 0 ? "red.500" : ""}
          onClick={async () => {
            const newVote = meVote < 0 ? 0 : -1;
            await voteMutation({ postId: id, value: newVote });
          }}
        />
      </Flex>
      <Text fontSize="xs">
        {new Date(parseInt(createdAt)).toLocaleString()}
      </Text>
      <Text fontSize="xx-small"> Posted by {owner.username}</Text>
      <Text mt={4}>{textSnippet}</Text>
    </Box>
  );
};
