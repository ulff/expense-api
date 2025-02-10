import {
  AddExpense,
  AddExpenseCommand,
} from "../../../../src/domain/use-case/expense/AddExpense";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/types/PLN";

import { InvalidFieldValidationError } from "../../../../src/domain/validator/error/InvalidFieldValidationError";
import { InvalidCategoryValidationError } from "../../../../src/domain/validator/error/InvalidCategoryValidationError";
import { MissingPeriodForDateError } from "../../../../src/domain/error/MissingPeriodForDateError";

import { InMemoryExpenseRepository } from "../../../../src/infrastructure/in-memory/InMemoryExpenseRepository";
import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("AddExpense Integration Tests", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let periodRepository: InMemoryPeriodRepository;
  let addExpense: AddExpense;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    periodRepository = new InMemoryPeriodRepository();
    addExpense = new AddExpense(expenseRepository, periodRepository);
  });

  test("should successfully add an expense", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );
    await periodRepository.savePeriod(period);

    const command: AddExpenseCommand = {
      zloty: 100,
      groszy: 50,
      spentOn: new Date("2025-02-15 12:07:12"),
      category: "food-orders",
      label: "Lunch",
    };

    const expense = await addExpense.execute(command);

    expect(expense).toBeInstanceOf(Expense);
    expect(expense.amount).toEqual(new PLN(100, 50));
    expect(expense.spentOn).toEqual(new Date("2025-02-15 12:07:12"));
    expect(expense.category).toBe("food-orders");
    expect(expense.label).toBe("Lunch");
  });

  test("should fail when adding an expense with an invalid category", async () => {
    const command: AddExpenseCommand = {
      zloty: 100,
      groszy: 50,
      spentOn: new Date("2025-02-15 12:07:12"),
      category: "invalid-category" as any,
      label: "Lunch",
    };

    await expect(addExpense.execute(command)).rejects.toThrow(
      InvalidCategoryValidationError,
    );
  });

  test("should fail when adding an expense with an invalid amount", async () => {
    const command: AddExpenseCommand = {
      zloty: -10,
      groszy: 50,
      spentOn: new Date("2025-02-15 12:07:12"),
      category: "food-orders",
      label: "Lunch",
    };

    await expect(addExpense.execute(command)).rejects.toThrow(
      InvalidFieldValidationError,
    );
  });

  test("should fail when adding an expense for a date with no associated period", async () => {
    const command: AddExpenseCommand = {
      zloty: 50,
      groszy: 25,
      spentOn: new Date("2025-03-15 12:07:12"),
      category: "food-orders",
      label: "Dinner",
    };

    await expect(addExpense.execute(command)).rejects.toThrow(
      MissingPeriodForDateError,
    );
  });
});
