import { ListAllExpenses } from "../../../../src/domain/use-case/expense/ListAllExpenses";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/PLN";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";

describe("ListAllExpenses Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let listAllExpenses: ListAllExpenses;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    listAllExpenses = new ListAllExpenses(expenseRepository);
  });

  test("should return an empty list when there are no expenses", async () => {
    const expenses = await listAllExpenses.execute();
    expect(expenses).toEqual([]);
  });

  test("should return all stored expenses", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    const expense1 = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    const expense2 = new Expense(
      "2",
      period,
      new PLN(200, 75),
      new Date("2025-02-20 18:45:30"),
      "entertainment",
      "Movie",
    );
    await expenseRepository.saveExpense(expense1);
    await expenseRepository.saveExpense(expense2);

    const expenses = await listAllExpenses.execute();
    expect(expenses.length).toBe(2);
    expect(expenses).toContainEqual(expense1);
    expect(expenses).toContainEqual(expense2);
  });
});
