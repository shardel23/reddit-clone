import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { BUTTON_COLOR_SCHEME } from "../utils/constants";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  const [genericError, setGenericError] = useState("");

  return (
    <Layout variant="small" title="Register">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          retypedPassword: "",
        }}
        onSubmit={async (
          { username, email, password, retypedPassword },
          { setErrors }
        ) => {
          if (password !== retypedPassword) {
            setGenericError("passwords don't match");
            return;
          }
          const response = await register({ username, email, password });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            />
            <InputField name="email" label="Email" placeholder="email" />
            <InputField
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />
            <InputField
              name="retypedPassword"
              label="Re-type password"
              placeholder="new password"
              type="password"
            />
            {genericError ? <Box color="red">{genericError}</Box> : null}
            <Button
              type="submit"
              colorScheme={BUTTON_COLOR_SCHEME}
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
