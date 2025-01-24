import express from "express";
import { getCurrentPeriod } from "../domain/model/period";
import { listExpensesForPeriod } from "../domain/model/expense";
import MissingPeriodForDateError from "../domain/error/MissingPeriodForDateError";

const router = express.Router();

router.get("/current", async (request, response) => {
  try {
    const period = await getCurrentPeriod();
    const expenses = await listExpensesForPeriod(period);

    // todo: map categories

    response.status(200).json(expenses);
  } catch (e) {
    if (e instanceof MissingPeriodForDateError) {
      response.status(404).json({ errors: e.message });
      return;
    }
    response.status(500).end();
  }
});

export default router;
