import express from "express";

import { RepositoryBus } from "../domain/repository/RespositoryBus";
import { ExpenseValidator } from "../domain/validator/ExpenseValidator";

import { MissingPeriodForDateError } from "../domain/error/MissingPeriodForDateError";
import { MissingExpenseError } from "../domain/error/MissingExpenseError";
import { ValidationError } from "../domain/validator/error/ValidationError";

import { ListAllExpenses } from "../domain/use-case/expense/ListAllExpenses";
import { GetExpenseById } from "../domain/use-case/expense/GetExpenseById";
import { DeleteExpense } from "../domain/use-case/expense/DeleteExpense";
import {
  AddExpense,
  AddExpenseCommand,
} from "../domain/use-case/expense/AddExpense";
import {
  ModifyExpense,
  ModifyExpenseCommand,
} from "../domain/use-case/expense/ModifyExpense";

export default function createRouter(repository: RepositoryBus) {
  const router = express.Router();

  const listAllExpenses = new ListAllExpenses(repository.expenseRepository);
  const getExpenseById = new GetExpenseById(repository.expenseRepository);
  const addExpense = new AddExpense(
    repository.expenseRepository,
    repository.periodRepository,
  );
  const modifyExpense = new ModifyExpense(
    repository.expenseRepository,
    repository.periodRepository,
  );
  const deleteExpense = new DeleteExpense(repository.expenseRepository);

  router.get("/", async (request, response) => {
    const expenses = await listAllExpenses.execute();
    response.json(expenses);
  });

  router.get("/:expenseId", async (request, response) => {
    const id = request.params.expenseId;

    try {
      const expense = await getExpenseById.execute({ id });
      response.json(expense);
    } catch (e) {
      if (e instanceof MissingExpenseError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.post("/", async (request, response) => {
    const zloty = request.body.zloty as string;
    const groszy = request.body.groszy as string;
    const category = request.body.category as string;
    const label = request.body.label as string;
    const spentOn = request.body.spentOn as string;

    const command = ExpenseValidator.createExpenseCommand({
      zloty,
      groszy,
      category,
      spentOn,
      label,
    }) as AddExpenseCommand;

    try {
      const expense = await addExpense.execute(command);
      response.status(201).json(expense);
    } catch (e) {
      if (e instanceof MissingPeriodForDateError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      if (e instanceof ValidationError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.put("/:expenseId", async (request, response) => {
    const id = request.params.expenseId;

    const zloty = request.body.zloty as string;
    const groszy = request.body.groszy as string;
    const category = request.body.category as string;
    const label = request.body.label as string;
    const spentOn = request.body.spentOn as string;

    const command = ExpenseValidator.createExpenseCommand({
      id,
      zloty,
      groszy,
      category,
      spentOn,
      label,
    }) as ModifyExpenseCommand;

    try {
      const expense = await modifyExpense.execute(command);
      response.status(201).json(expense);
    } catch (e) {
      if (e instanceof MissingExpenseError) {
        response.status(404).json({ errors: e.message });
        return;
      }
      if (e instanceof MissingPeriodForDateError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      if (e instanceof ValidationError) {
        response.status(400).json({ errors: e.message });
        return;
      }
      response.status(500).end();
    }
  });

  router.delete("/:expenseId", async (request, response) => {
    const id = request.params.expenseId;

    try {
      await deleteExpense.execute({ id });
      response.status(204).json({});
    } catch (e) {
      response.status(500).end();
    }
  });

  return router;
}
