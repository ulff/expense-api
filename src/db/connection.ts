import Pool from "pg-pool";
import { config } from "../config";

export const connection = new Pool({ connectionString: config.databaseUrl });
