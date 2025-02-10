import {
  GetExpenseById,
  GetExpenseByIdCommand,
} from "../../../../src/domain/use-case/expense/GetExpenseById";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/PLN";
import { MissingExpenseError } from "../../../../src/domain/error/MissingExpenseError";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";

describe("GetExpenseById Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let getExpenseById: GetExpenseById;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    getExpenseById = new GetExpenseById(expenseRepository);
  });

  test("should successfully retrieve an existing expense by ID", async () => {
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

    const command: GetExpenseByIdCommand = { id: "1" };
    const retrievedExpense = await getExpenseById.execute(command);

    expect(retrievedExpense).toBeInstanceOf(Expense);
    expect(retrievedExpense.id).toBe("1");
    expect(retrievedExpense.amount).toEqual(new PLN(100, 50));
    expect(retrievedExpense.spentOn).toEqual(new Date("2025-02-15 12:30:45"));
    expect(retrievedExpense.category).toBe("food-orders");
    expect(retrievedExpense.label).toBe("Lunch");
  });

  test("should throw MissingExpenseError when expense does not exist", async () => {
    const command: GetExpenseByIdCommand = { id: "999" };
    await expect(getExpenseById.execute(command)).rejects.toThrow(
      MissingExpenseError,
    );
  });
});
