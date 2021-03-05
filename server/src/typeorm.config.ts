import { ConnectionOptions } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export default {
  type: "postgres",
  database: "lireddit2",
  username: "postgres",
  password: "1q2w3e",
  logging: true,
  synchronize: true,
  entities: [Post, User],
  migrations: [path.join(__dirname, "./migrations/*")],
} as ConnectionOptions;
