import { ModifyExpenseCommand } from "../use-case/expense/ModifyExpense";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { ExpenseRepository } from "../repository/ExpenseRepository";
import { EmptyFieldValidationError } from "./error/EmptyFieldValidationError";
import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";

export class ExpenseValidator {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public static validateData(
    command: ModifyExpenseCommand | AddExpenseCommand,
  ): void {
    if (!Number.isInteger(command.zloty) || command.zloty < 0) {
      throw new InvalidFieldValidationError("zloty");
    }
    if (
      !Number.isInteger(command.groszy) ||
      command.groszy < 0 ||
      command.groszy >= 100
    ) {
      throw new InvalidFieldValidationError("groszy");
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
