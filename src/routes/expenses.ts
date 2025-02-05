import express from "express";

import { Repository } from "../domain/repository/Respository";
import { CategoryName } from "../domain/model/types/CategoryName";
import { MissingPeriodForDateError } from "../domain/validator/error/expense/MissingPeriodForDateError";
import { MissingExpenseError } from "../domain/validator/error/expense/MissingExpenseError";
import { ValidationError } from "../domain/validator/error/ValidationError";

import { ListAllExpenses } from "../domain/use-case/expense/ListAllExpenses";
import { AddExpense } from "../domain/use-case/expense/AddExpense";
import { ModifyExpense } from "../domain/use-case/expense/ModifyExpense";

export default function createRouter(repository: Repository) {
  const router = express.Router();

  const listAllExpenses = new ListAllExpenses(repository.expenseRepository);
  const addExpense = new AddExpense(
    repository.expenseRepository,
    repository.periodRepository,
  );
  const modifyExpense = new ModifyExpense(
    repository.expenseRepository,
    repository.periodRepository,
  );

  router.get("/", async (request, response) => {
    const expenses = await listAllExpenses.execute();
    response.json(expenses);
  });

  router.post("/", async (request, response) => {
    const zloty = request.body.zloty as number;
    const groszy = request.body.groszy as number;
    const category = request.body.category as CategoryName;
    const label = request.body.label as string;
    const spentOn = request.body.spentOn as Date;

    try {
      const expense = await addExpense.execute({
        zloty,
        groszy,
        label,
        category,
        spentOn,
      });
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

    const zloty = request.body.zloty as number;
    const groszy = request.body.groszy as number;
    const category = request.body.category as CategoryName;
    const label = request.body.label as string;
    const spentOn = request.body.spentOn as Date;

    try {
      const expense = await modifyExpense.execute({
        id,
        zloty,
        groszy,
        label,
        category,
        spentOn,
      });
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

  return router;
}
