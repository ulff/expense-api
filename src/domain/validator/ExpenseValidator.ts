import categories from "../../data/static/categories.json";

import { ModifyExpenseCommand } from "../use-case/expense/ModifyExpense";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";
import { CategoryName } from "../entity/types/CategoryName";

import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";
import { InvalidCategoryValidationError } from "./error/InvalidCategoryValidationError";
import { EmptyFieldValidationError } from "./error/EmptyFieldValidationError";

type ExpenseInput = {
  id?: string;
  zloty: string;
  groszy: string;
  spentOn: string;
  category: string;
  label?: string | null;
};

export class ExpenseValidator {
  public static createExpenseCommand(
    input: ExpenseInput,
  ): AddExpenseCommand | ModifyExpenseCommand {
    if (input.id) {
      return {
        id: input.id,
        zloty: parseInt(input.zloty, 10),
        groszy: parseInt(input.groszy, 10),
        spentOn: new Date(input.spentOn),
        category: input.category as CategoryName,
        label: input.label ?? null,
      } as ModifyExpenseCommand;
    }

    return {
      zloty: parseInt(input.zloty, 10),
      groszy: parseInt(input.groszy, 10),
      spentOn: new Date(input.spentOn),
      category: input.category as CategoryName,
      label: input.label ?? null,
    } as AddExpenseCommand;
  }

  public static validateData(
    command: ModifyExpenseCommand | AddExpenseCommand,
  ): void {
    if (!command.spentOn || isNaN(command.spentOn.getTime())) {
      throw new InvalidFieldValidationError("spentOn");
    }

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

    const validCategories: CategoryName[] = Object.keys(
      categories,
    ) as CategoryName[];

    if (!validCategories.includes(command.category as CategoryName)) {
      throw new InvalidCategoryValidationError(command.category);
    }

    return;
  }
}
