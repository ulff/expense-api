import { Expense } from "../types/expense";
import { addExpense } from "../db/repository/expense";

type expenseInputType = {
  zloty: number;
  groszy: number;
  label: string;
  category: string;
  spentOn: Date;
};

export const validateExpense: (input: expenseInputType) => string[] = ({
  zloty,
  groszy,
  category,
  spentOn,
}) => {
  const validationErrors = [];

  if (!zloty || !groszy) {
    validationErrors.push("Amount is empty or invalid.");
  }
  if (!category) {
    validationErrors.push("Category is empty or invalid.");
  }
  if (!spentOn) {
    validationErrors.push("Spent date is empty or invalid.");
  }

  return validationErrors;
};

export const saveExpense: (
  input: expenseInputType,
) => Promise<Expense> = async ({ zloty, groszy, category, label, spentOn }) => {
  const savedOn = new Date();

  return addExpense({
    zloty,
    groszy,
    category,
    label: label || null,
    spentOn: spentOn || savedOn,
    savedOn,
  });
};
