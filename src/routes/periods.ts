import express from "express";

import { Repository } from "../domain/repository/Respository";
import { MissingPeriodForDateError } from "../domain/validator/error/expense/MissingPeriodForDateError";
import { MissingPeriodError } from "../domain/validator/error/period/MissingPeriodError";
import { ValidationError } from "../domain/validator/error/ValidationError";

import { ListAllPeriods } from "../domain/use-case/period/ListAllPeriods";
import { GetCurrentPeriod } from "../domain/use-case/period/GetCurrentPeriod";
import { GetPeriodById } from "../domain/use-case/period/GetPeriodById";
import { AddPeriod } from "../domain/use-case/period/AddPeriod";
import { ModifyPeriod } from "../domain/use-case/period/ModifyPeriod";
import { ListExpensesForPeriod } from "../domain/use-case/expense/ListExpensesForPeriod";

export default function createRouter(repository: Repository) {
  const router = express.Router();

  const listAllPeriods = new ListAllPeriods(repository.periodRepository);
  const getCurrentPeriod = new GetCurrentPeriod(repository.periodRepository);
  const getPeriodById = new GetPeriodById(repository.periodRepository);
  const addPeriod = new AddPeriod(repository.periodRepository);
  const modifyPeriod = new ModifyPeriod(repository.periodRepository);
  const listExpensesForPeriod = new ListExpensesForPeriod(
    repository.expenseRepository,
  );

  router.get("/", async (request, response) => {
    const periods = await listAllPeriods.execute();
    response.json(periods);
  });

  router.get("/current", async (request, response) => {
    try {
      const period = await getCurrentPeriod.execute();
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
      const period = await getCurrentPeriod.execute();
      const expenses = await listExpensesForPeriod.execute({ period });

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
    const id = request.params.periodId;

    try {
      const period = await getPeriodById.execute({ id });
      response.json(period);
    } catch (e) {
      if (e instanceof MissingPeriodError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.get("/:periodId/expenses", async (request, response) => {
    const periodId = request.params.periodId;

    try {
      const period = await getPeriodById.execute({ id: periodId });
      const expenses = await listExpensesForPeriod.execute({ period });

      response.status(200).json(expenses);
    } catch (e) {
      if (e instanceof MissingPeriodError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.post("/", async (request, response) => {
    const dateStart = request.body.dateStart as Date;
    const dateEnd = request.body.dateEnd as Date;
    const name = request.body.name as string;

    try {
      const period = await addPeriod.execute({
        dateStart,
        dateEnd,
        name,
      });
      response.status(201).json(period);
    } catch (e) {
      if (e instanceof ValidationError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.put("/:periodId", async (request, response) => {
    const id = request.params.periodId;

    const dateStart = request.body.dateStart as Date;
    const dateEnd = request.body.dateEnd as Date;
    const name = request.body.name as string;

    try {
      const period = await modifyPeriod.execute({
        id,
        dateStart,
        dateEnd,
        name,
      });
      response.status(201).json(period);
    } catch (e) {
      if (e instanceof MissingPeriodError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      if (e instanceof ValidationError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  return router;
}
