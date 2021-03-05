import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validatePassword, validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

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
  @Query(() => [User])
  async allUsers(@Ctx() { req }: MyContext): Promise<User[]> {
    if (!req.session.userId) {
      return [];
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      return [];
    }
    if (!user.isAdmin) {
      return [];
    }
    const users = await User.find();
    return users;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }
    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const res = await validateRegister(options);
    if (res.errors.length !== 0) {
      return res;
    }

    const hashedPassword = await argon2.hash(options.password);
    const newUser = await User.create({
      username: options.username,
      hashedPassword,
      email: options.email,
      isAdmin: true,
    }).save();

    req.session.userId = newUser.id;
    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 10 // 10 minutes
    );

    sendEmail({
      subject: "Reset password",
      to: email,
      html: `<a href="http://localhost:3000/change-password/${token}"> reset password </a>`,
    });
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    const errors = validatePassword(newPassword);
    if (errors.length !== 0) {
      return {
        errors: [
          {
            field: "newPassword",
            message: errors[0].message,
          },
        ],
      };
    }

    const uid = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!uid) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(uid);
    const user = await User.findOne(userIdNum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(userIdNum, {
      hashedPassword: await argon2.hash(newPassword),
    });

    await redis.del(FORGET_PASSWORD_PREFIX + token);
    return { user };
  }
}
