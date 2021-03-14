import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, title, textSnippet, createdAt, owner, points, meVote } = post;
  const [, voteMutation] = useVoteMutation();
  const [currentPoints, setCurrentPoints] = useState(points);
  const [currentVote, setCurrentVote] = useState(meVote);

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex align="center">
        <Heading fontSize="xl" mr="2">
          {title}
        </Heading>
        <Text fontSize="sm" mr="2">
          {currentPoints}
        </Text>
        <ArrowUpIcon
          color={currentVote > 0 ? "green.500" : ""}
          onClick={async () => {
            const newVote = currentVote > 0 ? 0 : 1;
            const res = await voteMutation({ postId: id, value: newVote });
            if (res.data?.vote !== undefined) {
              setCurrentPoints(res.data.vote);
              setCurrentVote(newVote);
            }
          }}
        />
        <ArrowDownIcon
          color={currentVote < 0 ? "red.500" : ""}
          onClick={async () => {
            const newVote = currentVote < 0 ? 0 : -1;
            const res = await voteMutation({ postId: id, value: newVote });
            if (res.data?.vote !== undefined) {
              setCurrentPoints(res.data.vote);
              setCurrentVote(newVote);
            }
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
