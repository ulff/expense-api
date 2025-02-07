import { ModifyExpenseCommand } from "../use-case/expense/ModifyExpense";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";

export class ExpenseValidator {
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

    return;
  }
}
