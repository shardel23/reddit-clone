import { User } from "../entities/User";
import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }
  return next();
};

export const isAdminAuth: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }
  const user = await User.findOne(context.req.session.userId);
  if (!user) {
    throw new Error("not authenticated");
  }
  if (!user.isAdmin) {
    throw new Error("not authenticated");
  }
  return next();
};
