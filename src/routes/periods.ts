import express from "express";
import {
  savePeriod,
  validatePeriod,
  listAllPeriods,
  getCurrentPeriod,
  getPeriod,
} from "../domain/model/period";
import { listExpensesForPeriod } from "../domain/model/expense";
import MissingPeriodForDateError from "../domain/error/MissingPeriodForDateError";

const router = express.Router();

router.get("/", async (request, response) => {
  const periods = await listAllPeriods();
  response.json(periods);
});

router.get("/current", async (request, response) => {
  try {
    const period = await getCurrentPeriod();
    response.json(period);
  } catch (e) {
    if (e instanceof MissingPeriodForDateError) {
      response.status(404).json({ errors: e.message });
      return;
    }
    response.status(500).end();
  }
});

router.get("/current/expenses", async (request, response) => {
  try {
    const period = await getCurrentPeriod();
    const expenses = await listExpensesForPeriod(period);

    response.status(200).json(expenses);
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
    response.json(period);
  } catch (e) {
    response.status(500).end();
  }
});

router.get("/:periodId/expenses", async (request, response) => {
  const periodId = request.params.periodId;

  try {
    const period = await getPeriod(periodId);
    const expenses = await listExpensesForPeriod(period);

    response.status(200).json(expenses);
  } catch (e) {
    response.status(500).end();
  }
});

router.post("/", async (request, response) => {
  const dateStart = request.body.dateStart as Date;
  const dateEnd = request.body.dateEnd as Date;
  const name = request.body.name as string;

  const validationErrors = validatePeriod({
    dateStart,
    dateEnd,
    name,
  });
  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const period = await savePeriod({
      dateStart,
      dateEnd,
      name,
    });
    response.status(201).json(period);
  } catch (e) {
    response.status(500).end();
  }
});

router.put("/:periodId", async (request, response) => {
  const periodId = request.params.periodId;

  const dateStart = request.body.dateStart as Date;
  const dateEnd = request.body.dateEnd as Date;
  const name = request.body.name as string;

  const validationErrors = validatePeriod({
    periodId,
    dateStart,
    dateEnd,
    name,
  });

  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const period = await savePeriod({
      periodId,
      dateStart,
      dateEnd,
      name,
    });
    response.status(201).json(period);
  } catch (e) {
    response.status(500).end();
  }
});

export default router;
