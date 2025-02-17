import { RepositoryBus } from "../../repository/RespositoryBus";
import {
  AddExpense,
  AddExpenseCommand,
} from "../../use-case/expense/AddExpense";

const expensesCommands: AddExpenseCommand[] = [];

expensesCommands.push({
  zloty: 213,
  groszy: 72,
  spentOn: new Date("2024-12-02 19:00:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 302,
  groszy: 81,
  spentOn: new Date("2024-12-20 20:00:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 199,
  groszy: 32,
  spentOn: new Date("2025-01-02 19:00:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 208,
  groszy: 0,
  spentOn: new Date("2025-01-07 19:00:00"),
  category: "restaurants",
  label: "Sushi Nabo Gato",
});

expensesCommands.push({
  zloty: 12,
  groszy: 70,
  spentOn: new Date("2025-01-12 09:00:00"),
  category: "daily-shopping",
  label: "Żabka",
});

expensesCommands.push({
  zloty: 18,
  groszy: 57,
  spentOn: new Date("2025-01-22 19:00:00"),
  category: "daily-shopping",
});

expensesCommands.push({
  zloty: 67,
  groszy: 91,
  spentOn: new Date("2025-01-23 18:00:00"),
  category: "daily-shopping",
  label: "Auchan",
});

expensesCommands.push({
  zloty: 205,
  groszy: 92,
  spentOn: new Date("2025-01-23 19:00:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 209,
  groszy: 99,
  spentOn: new Date("2025-01-29 19:00:00"),
  category: "extra-shopping",
  label: "Ikea",
});

expensesCommands.push({
  zloty: 40,
  groszy: 0,
  spentOn: new Date("2025-02-02 19:00:00"),
  category: "kids",
  label: "Empik",
});

expensesCommands.push({
  zloty: 42,
  groszy: 12,
  spentOn: new Date("2025-02-02 20:00:00"),
  category: "daily-shopping",
});

expensesCommands.push({
  zloty: 267,
  groszy: 12,
  spentOn: new Date("2025-02-02 20:30:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 167,
  groszy: 67,
  spentOn: new Date("2025-02-06 18:00:00"),
  category: "daily-shopping",
  label: "Auchan",
});

expensesCommands.push({
  zloty: 67,
  groszy: 89,
  spentOn: new Date("2025-02-06 18:38:00"),
  category: "daily-shopping",
});

expensesCommands.push({
  zloty: 18,
  groszy: 20,
  spentOn: new Date("2025-02-06 18:49:00"),
  category: "daily-shopping",
  label: "Piekarnia",
});

expensesCommands.push({
  zloty: 199,
  groszy: 43,
  spentOn: new Date("2025-02-12 16:30:00"),
  category: "fuel",
});

expensesCommands.push({
  zloty: 23,
  groszy: 0,
  spentOn: new Date("2025-02-12 18:38:00"),
  category: "daily-shopping",
});

expensesCommands.push({
  zloty: 89,
  groszy: 0,
  spentOn: new Date("2025-02-14 19:00:00"),
  category: "restaurants",
  label: "Grycan",
});

export const populateExpenses = async (repository: RepositoryBus) => {
  const addExpense = new AddExpense(
    repository.expenseRepository,
    repository.periodRepository,
  );

  await Promise.all(
    expensesCommands.map(async (command) => {
      await addExpense.execute(command);
    }),
  );
};
