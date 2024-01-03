import "dotenv/config";
import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_CLIENT,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/db/migrations",
  },
};

export const knex = setupKnex(config);
