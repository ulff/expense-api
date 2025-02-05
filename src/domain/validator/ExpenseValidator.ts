import { ModifyExpenseCommand } from "../use-case/expense/ModifyExpense";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { ExpenseRepository } from "../repository/ExpenseRepository";
import { EmptyFieldError } from "./error/EmptyFieldError";

export class ExpenseValidator {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public static validateData(
    command: ModifyExpenseCommand | AddExpenseCommand,
  ): void {
    if (!command.zloty) {
      throw new EmptyFieldError("zloty");
    }
    if (!command.groszy) {
      throw new EmptyFieldError("groszy");
    }
    if (!command.category) {
      throw new EmptyFieldError("category");
    }
    if (!command.spentOn) {
      throw new EmptyFieldError("spentOn");
    }

    // todo: check amount formats
    // todo: check category existence
    // todo: check spent date format

    return;
  }
}
