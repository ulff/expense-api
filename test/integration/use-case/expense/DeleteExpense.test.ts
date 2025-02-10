import {
  DeleteExpense,
  DeleteExpenseCommand,
} from "../../../../src/domain/use-case/expense/DeleteExpense";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/types/PLN";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";

describe("DeleteExpense Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let deleteExpense: DeleteExpense;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    deleteExpense = new DeleteExpense(expenseRepository);
  });

  test("should successfully delete an existing expense", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    const expense = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    await expenseRepository.saveExpense(expense);

    const command: DeleteExpenseCommand = { id: "1" };
    await deleteExpense.execute(command);

    const retrievedExpense = await expenseRepository.getExpense("1");
    expect(retrievedExpense).toBeNull();
  });

  test("should not throw an error when deleting a non-existent expense", async () => {
    const command: DeleteExpenseCommand = { id: "999" };
    await expect(deleteExpense.execute(command)).resolves.not.toThrow();
  });
});
