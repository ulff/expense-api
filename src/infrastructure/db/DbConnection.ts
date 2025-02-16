import Pool from "pg-pool";
import { Client } from "pg";

import { config } from "../../config";

import DuplicateKeyError from "./error/DuplicateKeyError";
import DatabaseQueryError from "./error/DatabaseQueryError";
import FoundMultipleRowsError from "./error/FoundMultipleRowsError";

export class DbConnection {
  readonly connection: Pool<Client>;

  constructor() {
    console.log("Initializing database connection.");
    this.connection = new Pool({ connectionString: config.databaseUrl });
  }

  async execute(sql: string, params: any[]): Promise<void> {
    try {
      await this.connection.query(sql, params);
    } catch (e) {
      if (e.code && e.code === "23505") {
        throw new DuplicateKeyError(sql, e.constraint);
      }
      throw new DatabaseQueryError(sql, e);
    }
  }

  async fetchOne(sql: string, params: any[]): Promise<any> {
    try {
      const queryReturn = await this.connection.query(sql, params);

      if (queryReturn.rows.length > 1) {
        throw new FoundMultipleRowsError(sql, queryReturn.rows.length);
      }

      return queryReturn.rows[0] || [];
    } catch (e) {
      throw new DatabaseQueryError(sql, e);
    }
  }

  async fetchMany(sql: string, params: any[]): Promise<any[]> {
    try {
      const queryReturn = await this.connection.query(sql, params);

      return queryReturn.rows;
    } catch (e) {
      throw new DatabaseQueryError(sql, e);
    }
  }
}
