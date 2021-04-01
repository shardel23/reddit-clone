import { Box, Center, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Comment } from "./Comment";
import { useCommentsQuery } from "../generated/graphql";
import VizSensor from "react-visibility-sensor";

interface CommentSectionProps {
  postId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [variables, setVariables] = useState({
    postId,
    limit: 20,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = useCommentsQuery({
    variables,
  });

  if (!data && fetching) {
    return (
      <Center width="100%">
        <Spinner />
      </Center>
    );
  }

  return (
    <Box mt={4}>
      <Heading fontSize="l" mt={4}>
        Comments:
      </Heading>
      <Stack spacing={4}>
        {data?.getComments.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </Stack>
      {data && data.getComments.hasMore ? (
        <Flex>
          <VizSensor
            onChange={(isVisible) => {
              if (isVisible) {
                setVariables({
                  postId: variables.postId,
                  limit: variables.limit,
                  cursor:
                    data.getComments.comments[
                      data.getComments.comments.length - 1
                    ].updatedAt,
                });
              }
            }}
          >
            <Center width="100%">
              <Spinner />
            </Center>
          </VizSensor>
        </Flex>
      ) : null}
    </Box>
  );
};
