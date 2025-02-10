import express from "express";

import { RepositoryBus } from "../domain/repository/RespositoryBus";
import { PeriodValidator } from "../domain/validator/PeriodValidator";

import { MissingPeriodForDateError } from "../domain/error/MissingPeriodForDateError";
import { MissingPeriodError } from "../domain/error/MissingPeriodError";
import { ValidationError } from "../domain/validator/error/ValidationError";

import { ListAllPeriods } from "../domain/use-case/period/ListAllPeriods";
import { GetCurrentPeriod } from "../domain/use-case/period/GetCurrentPeriod";
import { GetPeriodById } from "../domain/use-case/period/GetPeriodById";
import { DeletePeriod } from "../domain/use-case/period/DeletePeriod";
import { ListExpensesForPeriod } from "../domain/use-case/expense/ListExpensesForPeriod";
import {
  AddPeriod,
  AddPeriodCommand,
} from "../domain/use-case/period/AddPeriod";
import {
  ModifyPeriod,
  ModifyPeriodCommand,
} from "../domain/use-case/period/ModifyPeriod";

export default function createRouter(repository: RepositoryBus) {
  const router = express.Router();

  const listAllPeriods = new ListAllPeriods(repository.periodRepository);
  const getCurrentPeriod = new GetCurrentPeriod(repository.periodRepository);
  const getPeriodById = new GetPeriodById(repository.periodRepository);
  const addPeriod = new AddPeriod(repository.periodRepository);
  const modifyPeriod = new ModifyPeriod(repository.periodRepository);
  const deletePeriod = new DeletePeriod(repository.periodRepository);
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
    const dateStart = request.body.dateStart as string;
    const dateEnd = request.body.dateEnd as string;
    const name = request.body.name as string;

    const command = PeriodValidator.createPeriodCommand({
      dateStart,
      dateEnd,
      name,
    }) as AddPeriodCommand;

    try {
      const period = await addPeriod.execute(command);
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

    const dateStart = request.body.dateStart as string;
    const dateEnd = request.body.dateEnd as string;
    const name = request.body.name as string;

    const command = PeriodValidator.createPeriodCommand({
      id,
      dateStart,
      dateEnd,
      name,
    }) as ModifyPeriodCommand;

    try {
      const period = await modifyPeriod.execute(command);
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

  router.delete("/:periodId", async (request, response) => {
    const id = request.params.periodId;

    try {
      await deletePeriod.execute({ id });
      response.status(204).json({});
    } catch (e) {
      response.status(500).end();
    }
  });

  return router;
}
