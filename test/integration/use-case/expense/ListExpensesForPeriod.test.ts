import {
  ListExpensesForPeriod,
  ListExpensesForPeriodCommand,
} from "../../../../src/domain/use-case/expense/ListExpensesForPeriod";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/types/PLN";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";

describe("ListExpensesForPeriod Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let listExpensesForPeriod: ListExpensesForPeriod;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    listExpensesForPeriod = new ListExpensesForPeriod(expenseRepository);
  });

  test("should return an empty list when there are no expenses for the given period", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    const command: ListExpensesForPeriodCommand = { period };

    const expenses = await listExpensesForPeriod.execute(command);
    expect(expenses).toEqual([]);
  });

  test("should return all expenses for the given period", async () => {
    const period1 = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    const period2 = new Period(
      "2",
      new Date("2025-03-01 00:00:00"),
      new Date("2025-03-31 23:59:59"),
      "March 2025",
    );

    const expense1 = new Expense(
      "1",
      period1,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    const expense2 = new Expense(
      "2",
      period1,
      new PLN(200, 75),
      new Date("2025-02-20 18:45:30"),
      "entertainment",
      "Movie",
    );
    const expense3 = new Expense(
      "3",
      period2,
      new PLN(50, 25),
      new Date("2025-03-10 14:00:00"),
      "commute",
      "Bus Ticket",
    );

    await expenseRepository.saveExpense(expense1);
    await expenseRepository.saveExpense(expense2);
    await expenseRepository.saveExpense(expense3);

    const command: ListExpensesForPeriodCommand = { period: period1 };
    const expenses = await listExpensesForPeriod.execute(command);
    expect(expenses.length).toBe(2);
    expect(expenses).toContainEqual(expense1);
    expect(expenses).toContainEqual(expense2);
  });
});
