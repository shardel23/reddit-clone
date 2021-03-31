import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { Comment } from "./Comment";
import { CommentFragment } from "../generated/graphql";

interface CommentSectionProps {
  comments: CommentFragment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <Box mt={4}>
      <Heading fontSize="l">Comments:</Heading>
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </Box>
  );
};
