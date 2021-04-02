import { Heading } from "@chakra-ui/react";
import React from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import dynamic from "next/dynamic";

const DynamicNavBar = dynamic(
  () => import("./NavBar").then((mod) => mod.NavBar),
  { ssr: false }
);

interface LayoutProps {
  variant?: WrapperVariant;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, title }) => {
  return (
    <>
      <DynamicNavBar />
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
