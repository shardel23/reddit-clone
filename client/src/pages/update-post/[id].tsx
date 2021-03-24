import { Button, Center, Spinner } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../../utils/constants";
import { createUrqlClient } from "../../utils/createUrqlClient";

const UpdatePost: NextPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;

  if (!postId) {
    return <div> Could not find post </div>;
  }
  const [{ data: postData, fetching }] = usePostQuery({
    variables: { id: parseInt(postId) },
  });

  const [, updatePost] = useUpdatePostMutation();

  let body = <></>;

  if (!postData && fetching) {
    body = (
      <Center width="100%">
        <Spinner />
      </Center>
    );
  } else {
    body = (
      <Formik
        initialValues={{
          title: postData?.post?.title,
          text: postData?.post?.text,
        }}
        onSubmit={async (values) => {
          const { error, data } = await updatePost({
            id: parseInt(postId),
            title: values.title ?? "",
            text: values.text ?? "",
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
    );
  }

  return (
    <Layout variant="small" title="Update Post">
      {body}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(UpdatePost);
