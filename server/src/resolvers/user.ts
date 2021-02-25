import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password }: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
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
    const user = await em.findOne(User, {
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
    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, { username, hashedPassword });
    await em.persistAndFlush(newUser);

    req.session.userId = newUser.id;
    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username,
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username doesn't exists",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.hashedPassword, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "username or password doesn't match",
          },
        ],
      };
    }

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
