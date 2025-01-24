import { Express } from "express-serve-static-core";
import categories from "./categories";
import periods from "./periods";
import expenses from "./expenses";
import summary from "./summary";
import status from "./status";

export const setupRoutes = (app: Express) => {
  app.use("/categories", categories);
  app.use("/periods", periods);
  app.use("/expenses", expenses);
  app.use("/summary", summary);
  app.use("/status", status);
};
