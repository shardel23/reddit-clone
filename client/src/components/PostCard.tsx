import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface PostCardProps {
  title: string;
  body: string;
}

export const PostCard: React.FC<PostCardProps> = ({ title, body }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{body}</Text>
    </Box>
  );
};
