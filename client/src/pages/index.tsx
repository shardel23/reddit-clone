import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { PostFeed } from "../components/PostFeed";

const Index = () => {
  return (
    <Layout>
      <PostFeed />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
