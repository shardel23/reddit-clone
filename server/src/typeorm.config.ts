import { ConnectionOptions } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";
import "dotenv-safe/config";
import { Comment } from "./entities/Comment";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  // synchronize: true,
  entities: [Post, User, Updoot, Comment],
  migrations: [path.join(__dirname, "./migrations/*")],
} as ConnectionOptions;
