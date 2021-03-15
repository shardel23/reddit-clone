import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Wrapper } from "../../components/Wrapper";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post: NextPage = () => {
  const router = useRouter();

  return <Wrapper variant="small">Post</Wrapper>;
};

export default withUrqlClient(createUrqlClient)(Post);
