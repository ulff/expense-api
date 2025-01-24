import express from "express";

const router = express.Router();

router.get("/online", async (request, response) => {
  response.status(200).json({ status: "ok" });
});

router.get("/auth", async (request, response) => {
  response.status(403).json({ status: "not authorized" });
});

export default router;
