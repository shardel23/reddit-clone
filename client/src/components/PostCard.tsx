import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useVoteMutation } from "../generated/graphql";

interface PostCardProps {
  postId: number;
  title: string;
  body: string;
  createdAt: string;
  owner: string;
  points: number;
  vote: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  postId,
  title,
  body,
  createdAt,
  owner,
  points,
  vote,
}) => {
  const [, voteMutation] = useVoteMutation();
  const [currentPoints, setCurrentPoints] = useState(points);
  const [currentVote, setCurrentVote] = useState(vote);

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
            const res = await voteMutation({ postId, value: newVote });
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
            const res = await voteMutation({ postId, value: newVote });
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
      <Text fontSize="xx-small"> Posted by {owner}</Text>
      <Text mt={4}>{body}</Text>
    </Box>
  );
};
