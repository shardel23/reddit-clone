import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = <></>;

  if (fetching) {
    // data is fetching
  } else if (data?.me) {
    // user is logged in
    body = (
      <Flex>
        <Box mr={2}>Hello {data.me.username}</Box>
        <Button variant="link"> Logout </Button>
      </Flex>
    );
  } else {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    );
  }

  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
