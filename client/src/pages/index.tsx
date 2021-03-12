import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { PostFeed } from "../components/PostFeed";

const Index = () => {
  return (
    <Layout>
      <Flex align="center" marginBottom="4">
        <Heading> LiReddit </Heading>
        <NextLink href="create-post">
          <Link ml="auto"> Create new post </Link>
        </NextLink>
      </Flex>
      <PostFeed />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
