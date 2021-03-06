import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ForgotPasswordProps {}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [completed, setCompleted] = useState(false);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async ({ email }) => {
          await forgotPassword({ email });
          setCompleted(true);
        }}
      >
        {({ isSubmitting }) =>
          completed ? (
            <Box>
              We've sent further instructions to reset your password to the
              given email address.
            </Box>
          ) : (
            <Form>
              <InputField name="email" label="Email" placeholder="email" />
              <Button
                type="submit"
                colorScheme={BUTTON_COLOR_SCHEME}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
