import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "./constants";
import dotenv from "dotenv";
import cors from "cors";
import { createConnection } from "typeorm";
import typeormConfig from "./typeorm.config";
import { createUserLoader } from "./utils/dataloader/createUserLoader";
import { createVoteLoader } from "./utils/dataloader/createVoteLoader";

const main = async () => {
  // Init dotenv
  dotenv.config();

  // Init ORM
  const conn = await createConnection(typeormConfig);
  await conn.runMigrations();

  const app = express();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
  });
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: process.env.SECRET_KEY || "default-secret",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
};

main().catch((err) => {
  console.error(err);
});
