import { Express } from "express-serve-static-core";
import categories from "./categories";
import expenses from "./expenses";
import status from "./status";

export const setupRoutes = (app: Express) => {
  app.use("/categories", categories);
  app.use("/expenses", expenses);
  app.use("/status", status);
};
