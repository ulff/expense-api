import * as dotevnv from "dotenv";

dotevnv.config();

const { PORT, NODE_ENV, DATABASE_URL, AUTH_TOKEN } = process.env;

type configType = {
  port: number;
  environment: string;
  databaseUrl: string;
  authToken: string;
};

export const config: configType = {
  port: +PORT,
  environment: NODE_ENV,
  databaseUrl: DATABASE_URL,
  authToken: AUTH_TOKEN,
};
