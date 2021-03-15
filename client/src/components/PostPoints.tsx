import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useVoteMutation } from "../generated/graphql";

interface PostPointsProps {
  postId: number;
  points: number;
  meVote: number;
}

export const PostPoints: React.FC<PostPointsProps> = ({
  postId,
  points,
  meVote,
}) => {
  const [, voteMutation] = useVoteMutation();

  return (
    <Flex align="center">
      <IconButton
        icon={<ArrowUpIcon />}
        colorScheme={meVote > 0 ? "green" : ""}
        variant="link"
        aria-label="Upvote"
        onClick={async () => {
          const newVote = meVote > 0 ? 0 : 1;
          await voteMutation({ postId, value: newVote });
        }}
      />
      <IconButton
        icon={<ArrowDownIcon />}
        colorScheme={meVote < 0 ? "red" : ""}
        variant="link"
        aria-label="Downvote"
        onClick={async () => {
          const newVote = meVote < 0 ? 0 : -1;
          await voteMutation({ postId, value: newVote });
        }}
      />
      <Text fontSize="sm" ml="2">
        {points}
      </Text>
    </Flex>
  );
};
