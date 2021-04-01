import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeleteCommentMutation } from "../generated/graphql";

interface EditDeleteCommentButtonsProps {
  commentId: number;
  postId: number;
  onEditClick: () => void;
}

export const EditDeleteCommentButtons: React.FC<EditDeleteCommentButtonsProps> = ({
  commentId,
  postId,
  onEditClick,
}) => {
  const [, deleteComment] = useDeleteCommentMutation();

  return (
    <Box>
      <IconButton
        icon={<EditIcon />}
        onClick={onEditClick}
        aria-label="Edit Post"
      />
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
