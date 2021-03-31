import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { CommentFragment } from "../generated/graphql";

interface CommentProps {
  comment: CommentFragment;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Box mt={4}>
      <Flex align="center">
        <Heading fontSize="sm" mr={4}>
          {comment.owner.username}
        </Heading>
        <Text fontSize="xs">
          {new Date(parseInt(comment.updatedAt)).toLocaleString()}
        </Text>
      </Flex>
      <Flex>
        <Text>{comment.content}</Text>
      </Flex>
    </Box>
  );
};
