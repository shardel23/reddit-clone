import { Heading } from "@chakra-ui/react";
import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, title }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>
        {title ? (
          <Heading mb="4" textAlign="center">
            {title}
          </Heading>
        ) : null}
        {children}
      </Wrapper>
    </>
  );
};
