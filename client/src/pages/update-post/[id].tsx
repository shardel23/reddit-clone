import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { useUpdatePostMutation } from "../../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../../utils/constants";
import { createUrqlClient } from "../../utils/createUrqlClient";

const UpdatePost: NextPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;

  const [, updatePost] = useUpdatePostMutation();

  return (
    <Layout variant="small" title="Create Post">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error, data } = await updatePost({
            id: parseInt(postId),
            title: values.title,
            text: values.text,
          });
          if (!error && data?.updatePost) {
            router.push(`/post/${postId}`);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="title" />
            <InputField
              name="text"
              label="Body"
              placeholder="text..."
              textarea={true}
            />
            <Button
              type="submit"
              colorScheme={BUTTON_COLOR_SCHEME}
              isLoading={isSubmitting}
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(UpdatePost);
