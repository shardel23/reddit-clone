import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  CommentFragment,
  useMeQuery,
  useUpdateCommentMutation,
} from "../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";
import { EditDeleteCommentButtons } from "./EditDeleteCommentButtons";

interface CommentProps {
  comment: CommentFragment;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [meQuery] = useMeQuery();
  const [, updateComment] = useUpdateCommentMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempComment, setTempComment] = useState(comment.content);
  const router = useRouter();

  return (
    <Box mt={4} shadow="md" borderWidth="1px" p="2">
      <Flex align="center">
        <Heading fontSize="sm" mr={4}>
          {comment.owner.username}
        </Heading>
        <Text fontSize="xs">
          {new Date(parseInt(comment.createdAt)).toLocaleString()}
        </Text>
        {meQuery.data?.me?.id === comment.owner.id ? (
          <Box ml="auto">
            <EditDeleteCommentButtons
              commentId={comment.id}
              postId={comment.postId}
              onEditClick={() => {
                setIsEditing(true);
              }}
            />
          </Box>
        ) : null}
      </Flex>
      <Flex>
        {isEditing ? (
          <>
            <Input
              name="NewComment"
              value={tempComment}
              onChange={(event) => {
                setTempComment(event.target.value);
              }}
              variant="outline"
            />
            <Button
              onClick={async () => {
                const { error, data } = await updateComment({
                  id: comment.id,
                  postId: comment.postId,
                  content: tempComment,
                });
                if (!error && data?.updateComment) {
                  router.reload();
                }
              }}
              colorScheme={BUTTON_COLOR_SCHEME}
              p={4}
              ml={2}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setTempComment(comment.content);
              }}
              colorScheme={BUTTON_COLOR_SCHEME}
              p={4}
              ml={2}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Text>{comment.content}</Text>
        )}
      </Flex>
    </Box>
  );
};
