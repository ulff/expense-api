import { Express } from "express-serve-static-core";
import categories from "./categories";
import periods from "./periods";
import expenses from "./expenses";
import summary from "./summary";
import status from "./status";

export const setupRoutes = (app: Express) => {
  const repository = app.get("repository");

  app.use("/categories", categories);
  app.use("/periods", periods(repository));
  app.use("/expenses", expenses(repository));
  app.use("/summary", summary(repository));
  app.use("/status", status);
};
