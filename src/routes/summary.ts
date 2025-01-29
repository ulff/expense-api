import express from "express";
import { getCurrentPeriod, getPeriod } from "../domain/model/period";
import { listExpensesForPeriod } from "../domain/model/expense";
import { prepareSummary } from "../domain/model/summary";
import MissingPeriodForDateError from "../domain/error/MissingPeriodForDateError";
import categories from "../data/categories.json";

const router = express.Router();

router.get("/current", async (request, response) => {
  try {
    const period = await getCurrentPeriod();
    const expenses = await listExpensesForPeriod(period);

    const summary = await prepareSummary({ period, expenses, categories });

    response.status(200).json(summary);
  } catch (e) {
    if (e instanceof MissingPeriodForDateError) {
      response.status(404).json({ errors: e.message });
      return;
    }
    response.status(500).end();
  }
});

router.get("/:periodId", async (request, response) => {
  const periodId = request.params.periodId;

  try {
    const period = await getPeriod(periodId);
    const expenses = await listExpensesForPeriod(period);

    const summary = await prepareSummary({ period, expenses, categories });

    response.status(200).json(summary);
  } catch (e) {
    if (e instanceof MissingPeriodForDateError) {
      response.status(404).json({ errors: e.message });
      return;
    }
    response.status(500).end();
  }
});

export default router;
