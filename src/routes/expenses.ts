import express from "express";
import { listExpenses } from "../db/repository/expense";
import { saveExpense, validateExpense } from "../domain/expense";

const router = express.Router();

router.get("/", async (request, response) => {
  const expenses = await listExpenses();
  response.json(expenses);
});

router.post("/", async (request, response) => {
  const zloty = request.body.zloty as number;
  const groszy = request.body.groszy as number;
  const category = request.body.category as string;
  const label = request.body.label as string;
  const spentOn = request.body.spentOn as Date;

  const validationErrors = validateExpense({
    zloty,
    groszy,
    category,
    label,
    spentOn,
  });
  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const expense = await saveExpense({
      zloty,
      groszy,
      label,
      category,
      spentOn,
    });
    response.status(201).json(expense);
  } catch (e) {
    response.status(500).end();
  }
});

router.put("/:expenseId", async (request, response) => {
  const expenseId = request.params.expenseId;

  const zloty = request.body.zloty as number;
  const groszy = request.body.groszy as number;
  const category = request.body.category as string;
  const label = request.body.label as string;
  const spentOn = request.body.spentOn as Date;

  const validationErrors = validateExpense({
    expenseId,
    zloty,
    groszy,
    category,
    label,
    spentOn,
  });
  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const expense = await saveExpense({
      expenseId,
      zloty,
      groszy,
      label,
      category,
      spentOn,
    });
    response.status(201).json(expense);
  } catch (e) {
    response.status(500).end();
  }
});

export default router;
