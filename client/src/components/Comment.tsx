import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { CommentFragment, useMeQuery } from "../generated/graphql";
import { EditDeleteCommentButtons } from "./EditDeleteCommentButtons";

interface CommentProps {
  comment: CommentFragment;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [meQuery] = useMeQuery();

  return (
    <Box mt={4} shadow="md" borderWidth="1px" p="2">
      <Flex align="center">
        <Heading fontSize="sm" mr={4}>
          {comment.owner.username}
        </Heading>
        <Text fontSize="xs">
          {new Date(parseInt(comment.updatedAt)).toLocaleString()}
        </Text>
        {meQuery.data?.me?.id === comment.owner.id ? (
          <Box ml="auto">
            <EditDeleteCommentButtons
              commentId={comment.id}
              postId={comment.postId}
            />
          </Box>
        ) : null}
      </Flex>
      <Flex>
        <Text>{comment.content}</Text>
      </Flex>
    </Box>
  );
};
