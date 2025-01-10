import express from "express";
import categories from "../data/categories.json";

const router = express.Router();

router.get("/", async (request, response) => {
  response.status(200).json(categories);
});

export default router;
