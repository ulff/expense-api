import express from "express";
import { authorize } from "../middleware";

const router = express.Router();

router.get("/online", async (request, response) => {
  response.status(200).json({ status: "OK" });
});

router.get("/auth", authorize, async (request, response) => {
  response.status(200).json({ status: "Authorized" });
});

export default router;
