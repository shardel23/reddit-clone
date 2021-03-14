import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
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
        <IconButton
          icon={<ArrowUpIcon />}
          colorScheme={meVote > 0 ? "green" : ""}
          variant="link"
          aria-label="Upvote"
          onClick={async () => {
            const newVote = meVote > 0 ? 0 : 1;
            await voteMutation({ postId: id, value: newVote });
          }}
        />
        <IconButton
          icon={<ArrowDownIcon />}
          colorScheme={meVote < 0 ? "red" : ""}
          variant="link"
          aria-label="Downvote"
          onClick={async () => {
            const newVote = meVote < 0 ? 0 : -1;
            await voteMutation({ postId: id, value: newVote });
          }}
        />
        <Text fontSize="sm" ml="2">
          {points}
        </Text>
      </Flex>
      <Text fontSize="xs">
        {new Date(parseInt(createdAt)).toLocaleString()}
      </Text>
      <Text fontSize="xx-small"> Posted by {owner.username}</Text>
      <Text mt={4}>{textSnippet}</Text>
    </Box>
  );
};
