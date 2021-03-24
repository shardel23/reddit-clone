import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  postId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  postId,
}) => {
  const [, deletePost] = useDeletePostMutation();

  return (
    <Box>
      <NextLink href={`/update-post/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete Post"
        ml="2"
        onClick={async () => {
          await deletePost({ id: postId });
        }}
      />
    </Box>
  );
};
