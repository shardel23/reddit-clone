import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = <></>;

  if (fetching) {
    // data is fetching
  } else if (data?.me) {
    // user is logged in
    body = (
      <Flex>
        <Box mr={2}>Hello {data.me.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
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
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4} align="center">
      <NextLink href="/">
        <Link>
          <Heading> LiReddit </Heading>
        </Link>
      </NextLink>
      <NextLink href="/create-post">
        <Link ml="8"> Create a new post </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
