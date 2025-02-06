import { ModifyExpenseCommand } from "../use-case/expense/ModifyExpense";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { ExpenseRepository } from "../repository/ExpenseRepository";
import { EmptyFieldValidationError } from "./error/EmptyFieldValidationError";

export class ExpenseValidator {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public static validateData(
    command: ModifyExpenseCommand | AddExpenseCommand,
  ): void {
    if (!command.zloty) {
      throw new EmptyFieldValidationError("zloty");
    }
    if (!command.groszy) {
      throw new EmptyFieldValidationError("groszy");
    }
    if (!command.category) {
      throw new EmptyFieldValidationError("category");
    }
    if (!command.spentOn) {
      throw new EmptyFieldValidationError("spentOn");
    }

    // todo: check amount formats
    // todo: check category existence
    // todo: check spent date format

    return;
  }
}
