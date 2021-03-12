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
}

export const PostCard: React.FC<PostCardProps> = ({
  postId,
  title,
  body,
  createdAt,
  owner,
  points,
}) => {
  const [, vote] = useVoteMutation();
  const [currentPoints, setCurrentPoints] = useState(points);

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
          onClick={async () => {
            const res = await vote({ postId, value: 1 });
            if (res.data?.vote) {
              setCurrentPoints(res.data.vote);
            }
          }}
        />
        <ArrowDownIcon
          onClick={async () => {
            const res = await vote({ postId, value: -1 });
            if (res.data?.vote) {
              setCurrentPoints(res.data.vote);
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
