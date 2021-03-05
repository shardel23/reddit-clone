import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { PostCard } from "../components/PostCard";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <NextLink href="create-post">
        <Link> Create new post </Link>
      </NextLink>
      <br />
      <br />
      <h1> Posts: </h1>
      <br />
      {!data ? (
        <div> Loading... </div>
      ) : (
        data.posts.map((post) => (
          <PostCard title={post.title} body={post.text} key={post.id} />
        ))
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
