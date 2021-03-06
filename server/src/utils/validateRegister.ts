import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import { User } from "../entities/User";

export const validateRegister = async (input: UsernamePasswordInput) => {
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
  let user = await User.findOne({
    where: {
      username,
    },
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
  user = await User.findOne({
    where: {
      email,
    },
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
  const errors = validatePassword(password);
  if (errors.length != 0) {
    return {
      errors,
    };
  }
  return { errors: [] };
};

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return [
      {
        field: "password",
        message: "password length must be at least 6 characters long",
      },
    ];
  }
  return [];
};
