import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { User } from "../entities/User";

export const validateRegister = async (
  input: UsernamePasswordInput,
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
) => {
  const { username, password } = input;
  const email = input.email as string;
  if (username.length <= 2) {
    return {
      errors: [
        {
          field: "username",
          message: "username length must be greater than 2",
        },
      ],
    };
  }
  let user = await em.findOne(User, {
    username,
  });
  if (user) {
    return {
      errors: [
        {
          field: "username",
          message: "username already exists",
        },
      ],
    };
  }
  if (email.length <= 2 || !email.includes("@")) {
    return {
      errors: [
        {
          field: "email",
          message: "invalid email address",
        },
      ],
    };
  }
  user = await em.findOne(User, {
    email,
  });
  if (user) {
    return {
      errors: [
        {
          field: "email",
          message: "email address already exists",
        },
      ],
    };
  }
  if (password.length < 6) {
    return {
      errors: [
        {
          field: "password",
          message: "password length must be at least 6 characters long",
        },
      ],
    };
  }
  return { errors: [] };
};
