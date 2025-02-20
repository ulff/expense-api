import { RequestHandler } from "express";
import { config } from "./config";

export const authorize: RequestHandler = (req, res, next) => {
  const authToken = req.headers["auth-token"];

  if (!config.authToken || !authToken || authToken !== config.authToken) {
    res.status(403).json({ status: "Not authorized" });
    return;
  }

  next();
};
