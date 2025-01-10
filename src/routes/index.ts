import {Express} from "express-serve-static-core";
import categories from "./categories";

export const setupRoutes = (app: Express) => {
  app.use("/categories", categories);
};
