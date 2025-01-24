import * as dotevnv from "dotenv";

dotevnv.config();

const { PORT, NODE_ENV, DATABASE_URL } = process.env;

type configType = {
  port: number;
  environment: string;
  databaseUrl: string;
};

export const config: configType = {
  port: +PORT,
  environment: NODE_ENV,
  databaseUrl: DATABASE_URL,
};
