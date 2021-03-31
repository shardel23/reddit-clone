import { DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeleteCommentMutation } from "../generated/graphql";

interface EditDeleteCommentButtonsProps {
  commentId: number;
  postId: number;
}

export const EditDeleteCommentButtons: React.FC<EditDeleteCommentButtonsProps> = ({
  commentId,
  postId,
}) => {
  const [, deleteComment] = useDeleteCommentMutation();

  return (
    <Box>
      {/* <NextLink href={`/update-post/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="Edit Post" />
      </NextLink> */}
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete Comment"
        onClick={async () => {
          await deleteComment({ id: commentId, postId });
        }}
      />
    </Box>
  );
};
