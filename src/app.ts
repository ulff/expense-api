import express from "express";
import cors from "cors";
import helmet from "helmet";

import { setupRoutes } from "./application";
import { config } from "./config";

import { DbRepositoryBus } from "./infrastructure/db/DbRepositoryBus";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.set("repository", new DbRepositoryBus());

setupRoutes(app);

const httpServer = app.listen(config.port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${config.port}`);
});

process.on("SIGTERM", () => {
  // tslint:disable-next-line:no-console
  console.log("Caught SIGTERM, shutting down.");
  httpServer.close(() => process.exit(143));
});
