import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from "../generated/graphql";
import { PostPoints } from "./PostPoints";
import NextLink from "next/link";
import { DeleteIcon } from "@chakra-ui/icons";
import { MyModal } from "./MyModal";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, title, textSnippet, createdAt, owner, points, meVote } = post;
  const [, deletePost] = useDeletePostMutation();

  const [isShowModal, setShowModal] = useState(false);

  return (
    <>
      <Box p={5} shadow="md" borderWidth="1px">
        <Flex align="center">
          <NextLink href={`/post/${id}`}>
            <Link>
              <Heading fontSize="xl" mr="2">
                {title}
              </Heading>
            </Link>
          </NextLink>
          <PostPoints postId={id} points={points} meVote={meVote} />
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete Post"
            ml="auto"
            onClick={async () => {
              const response = await deletePost({ id });
              if (!response.data?.deletePost) {
                setShowModal(true);
              }
            }}
          />
        </Flex>
        <Text fontSize="xs">
          {new Date(parseInt(createdAt)).toLocaleString()}
        </Text>
        <Text fontSize="xx-small"> Posted by {owner.username}</Text>
        <Text mt={4}>{textSnippet}</Text>
      </Box>
      <MyModal
        isOpen={isShowModal}
        onClose={() => setShowModal(false)}
        isCentered
        header={"Delete Post"}
        body={"Only the post's owner can delete this post"}
      />
    </>
  );
};
