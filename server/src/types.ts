import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/dataloader/createUserLoader";
import { createVoteLoader } from "./utils/dataloader/createVoteLoader";
import { createPostLoader } from "./utils/dataloader/createPostLoader";

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  voteLoader: ReturnType<typeof createVoteLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
};
