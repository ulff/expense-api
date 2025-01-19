import { connection } from "./connection";
import { Client, PoolClient } from "pg";
import DuplicateKeyError from "./error/DuplicateKeyError";

let db: (Client & PoolClient) | null = null;

export const execute: (sql: string, params: any[]) => Promise<void> = async (
  sql,
  params,
) => {
  try {
    if (!db) {
      console.log("Reinitializing database connection...");
      db = await connection.connect();
    }
    await db.query(sql, params);
  } catch (e) {
    if (e.code && e.code === "23505") {
      throw new DuplicateKeyError(e.constraint);
    }
    console.error("Database error (execute): ", e);
    throw e;
  }
};

export const fetchOne: (sql: string, params: any[]) => Promise<any> = async (
  sql,
  params,
) => {
  try {
    if (!db) {
      console.log("Reinitializing database connection...");
      db = await connection.connect();
    }
    const queryReturn = await db.query(sql, params);

    return queryReturn.rows[0] || [];
  } catch (e) {
    console.error("Database error (fetchOne): ", e);
    throw e;
  }
};

export const fetchMany: (sql: string, params: any[]) => Promise<any[]> = async (
  sql,
  params,
) => {
  try {
    if (!db) {
      console.log("Reinitializing database connection...");
      db = await connection.connect();
    }
    const queryReturn = await db.query(sql, params);

    return queryReturn.rows;
  } catch (e) {
    console.error("Database error (fetchMany): ", e);
    throw e;
  }
};
