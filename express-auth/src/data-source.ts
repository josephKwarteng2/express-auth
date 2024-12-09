import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: !!process.env.POSTGRES_SYNC,
  logging: !!process.env.POSTGRES_LOGGING,
  entities: [User],
  migrations: ["build/migrations/*.js"],
  subscribers: ["build/subscriber/**/*.js"],
  ssl: !!process.env.POSTGRES_SSL,
});
