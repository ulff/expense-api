import {
  ModifyExpense,
  ModifyExpenseCommand,
} from "../../../../src/domain/use-case/expense/ModifyExpense";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/types/PLN";

import { MissingExpenseError } from "../../../../src/domain/error/MissingExpenseError";
import { InvalidCategoryValidationError } from "../../../../src/domain/validator/error/InvalidCategoryValidationError";
import { MissingPeriodForDateError } from "../../../../src/domain/error/MissingPeriodForDateError";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";
import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("ModifyExpense Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let periodRepository: InMemoryPeriodRepository;
  let modifyExpense: ModifyExpense;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    periodRepository = new InMemoryPeriodRepository();
    modifyExpense = new ModifyExpense(expenseRepository, periodRepository);
  });

  test("should successfully modify an existing expense", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    await periodRepository.savePeriod(period);

    const expense = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    await expenseRepository.saveExpense(expense);

    const command: ModifyExpenseCommand = {
      id: "1",
      zloty: 150,
      groszy: 75,
      spentOn: new Date("2025-02-16 14:45:30"),
      category: "restaurants",
      label: "Dinner",
    };

    const modifiedExpense = await modifyExpense.execute(command);

    expect(modifiedExpense).toBeInstanceOf(Expense);
    expect(modifiedExpense.amount).toEqual(new PLN(150, 75));
    expect(modifiedExpense.spentOn).toEqual(new Date("2025-02-16 14:45:30"));
    expect(modifiedExpense.category).toBe("restaurants");
    expect(modifiedExpense.label).toBe("Dinner");
  });

  test("should fail when modifying a non-existent expense", async () => {
    const command: ModifyExpenseCommand = {
      id: "999",
      zloty: 50,
      groszy: 25,
      spentOn: new Date("2025-02-20 18:00:00"),
      category: "entertainment",
      label: "Movie",
    };

    await expect(modifyExpense.execute(command)).rejects.toThrow(
      MissingExpenseError,
    );
  });

  test("should fail when modifying an expense with an invalid category", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    await periodRepository.savePeriod(period);

    const expense = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 10:15:30"),
      "food-orders",
      "Lunch",
    );
    await expenseRepository.saveExpense(expense);

    const command: ModifyExpenseCommand = {
      id: "1",
      zloty: 75,
      groszy: 30,
      spentOn: new Date("2025-02-17 09:45:20"),
      category: "invalid-category" as any,
      label: "Brunch",
    };

    await expect(modifyExpense.execute(command)).rejects.toThrow(
      InvalidCategoryValidationError,
    );
  });

  test("should fail when modifying an expense to a date with no associated period", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    await periodRepository.savePeriod(period);

    const expense = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    await expenseRepository.saveExpense(expense);

    const command: ModifyExpenseCommand = {
      id: "1",
      zloty: 100,
      groszy: 50,
      spentOn: new Date("2026-03-15 12:30:45"),
      category: "food-orders",
      label: "Lunch",
    };

    await expect(modifyExpense.execute(command)).rejects.toThrow(
      MissingPeriodForDateError,
    );
  });
});
