import { Button, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useCreateCommentMutation } from "../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";
import { InputField } from "./InputField";

interface NewCommentSectionProps {
  postId: number;
}

export const NewCommentSection: React.FC<NewCommentSectionProps> = ({
  postId,
}) => {
  const router = useRouter();
  const [, createComment] = useCreateCommentMutation();

  return (
    <Formik
      initialValues={{ comment: "" }}
      onSubmit={async (values) => {
        const { error } = await createComment({
          postId,
          content: values.comment,
        });
        if (!error) {
          router.reload();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex align="center">
            <InputField name="comment" placeholder="Add new comment..." />
            <Button
              type="submit"
              colorScheme={BUTTON_COLOR_SCHEME}
              isLoading={isSubmitting}
              p={4}
            >
              Comment
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
