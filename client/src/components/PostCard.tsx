import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface PostCardProps {
  title: string;
  body: string;
  createdAt: string;
  owner: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  body,
  createdAt,
  owner,
}) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{title}</Heading>
      <Text fontSize="xs">
        {new Date(parseInt(createdAt)).toLocaleString()}
      </Text>
      <Text fontSize="xx-small"> Posted by {owner}</Text>
      <Text mt={4}>{body}</Text>
    </Box>
  );
};
