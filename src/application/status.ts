import express from "express";

const router = express.Router();

router.get("/online", async (request, response) => {
  response.status(200).json({ status: "OK" });
});

router.get("/auth", async (request, response) => {
  response.status(200).json({ status: "Authorized" });
});

export default router;
