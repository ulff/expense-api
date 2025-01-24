import { Expense } from "../types/expense";
import { addExpense, updateExpense } from "../../db/repository/expense";
import { getPeriodForDate } from "../../db/repository/period";
import MissingPeriodForDateError from "../error/MissingPeriodForDateError";

type expenseInputType = {
  expenseId?: string;
  zloty: number;
  groszy: number;
  label?: string;
  category: string;
  spentOn: Date;
};

const validateExpense: (input: expenseInputType) => string[] = ({
  expenseId,
  zloty,
  groszy,
  category,
  spentOn,
}) => {
  const validationErrors = [];

  if (expenseId) {
    // todo: if periodId then check if exists
  }

  if (!zloty || !groszy) {
    validationErrors.push("Amount is empty.");
  }
  if (!category) {
    validationErrors.push("Category is empty.");
  }
  if (!spentOn) {
    validationErrors.push("Spent date is empty.");
  }

  // todo: check amount formats
  // todo: check category existence
  // todo: check spent date format

  return validationErrors;
};

const saveExpense: (input: expenseInputType) => Promise<Expense> = async ({
  expenseId,
  zloty,
  groszy,
  category,
  label,
  spentOn,
}) => {
  const period = await getPeriodForDate(spentOn);
  if (!period) {
    throw new MissingPeriodForDateError(spentOn);
  }

  if (expenseId) {
    return updateExpense({
      expenseId,
      period,
      zloty,
      groszy,
      category,
      label: label || null,
      spentOn,
    });
  } else {
    return addExpense({
      period,
      zloty,
      groszy,
      category,
      label: label || null,
      spentOn,
    });
  }
};

export { validateExpense, saveExpense };
