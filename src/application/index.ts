import { Express } from "express-serve-static-core";
import { authorize } from "../middleware";

import categories from "./categories";
import periods from "./periods";
import expenses from "./expenses";
import summary from "./summary";
import status from "./status";

export const setupRoutes = (app: Express) => {
  const repository = app.get("repository");

  app.use("/status", status);
  app.use("/categories", authorize, categories);
  app.use("/periods", authorize, periods(repository));
  app.use("/expenses", authorize, expenses(repository));
  app.use("/summary", authorize, summary(repository));
};
