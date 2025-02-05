import express from "express";

import categories from "../data/categories.json";
import { MissingPeriodError } from "../domain/validator/error/period/MissingPeriodError";
import { MissingPeriodForDateError } from "../domain/validator/error/expense/MissingPeriodForDateError";
import { Repository } from "../domain/repository/Respository";

import { GetCurrentPeriod } from "../domain/use-case/period/GetCurrentPeriod";
import { GetPeriodById } from "../domain/use-case/period/GetPeriodById";
import { ListExpensesForPeriod } from "../domain/use-case/expense/ListExpensesForPeriod";
import { PrepareSummaryForPeriod } from "../domain/use-case/summary/PrepareSummaryForPeriod";

export default function createRouter(repository: Repository) {
  const router = express.Router();

  const getCurrentPeriod = new GetCurrentPeriod(repository.periodRepository);
  const getPeriodById = new GetPeriodById(repository.periodRepository);
  const listExpensesForPeriod = new ListExpensesForPeriod(
    repository.expenseRepository,
  );
  const prepareSummaryForPeriod = new PrepareSummaryForPeriod();

  router.get("/current", async (request, response) => {
    try {
      const period = await getCurrentPeriod.execute();
      const expenses = await listExpensesForPeriod.execute({ period });

      const summary = prepareSummaryForPeriod.execute({
        period,
        expenses,
        categories,
      });

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
    const id = request.params.periodId;

    try {
      const period = await getPeriodById.execute({ id });
      const expenses = await listExpensesForPeriod.execute({ period });

      const summary = prepareSummaryForPeriod.execute({
        period,
        expenses,
        categories,
      });

      response.status(200).json(summary);
    } catch (e) {
      if (e instanceof MissingPeriodError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  return router;
}
