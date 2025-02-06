import { v4 as Uuidv4 } from "uuid";

import { Expense } from "../../entity/Expense";
import { PLN } from "../../entity/PLN";
import { CategoryName } from "../../entity/types/CategoryName";

import { ExpenseRepository } from "../../repository/ExpenseRepository";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { ExpenseValidator } from "../../validator/ExpenseValidator";

export type AddExpenseCommand = {
  zloty: number;
  groszy: number;
  spentOn: Date;
  category: CategoryName;
  label?: string | null;
};

export class AddExpense {
  private readonly repository: ExpenseRepository;
  private readonly validator: ExpenseValidator;
  private readonly periodRepository: PeriodRepository;

  constructor(
    repository: ExpenseRepository,
    periodRepository: PeriodRepository,
  ) {
    this.repository = repository;
    this.periodRepository = periodRepository;
    this.validator = new ExpenseValidator(repository);
  }

  public execute(command: AddExpenseCommand): Promise<Expense> {
    return new Promise(async (resolve, reject) => {
      try {
        ExpenseValidator.validateData(command);

        const id: string = Uuidv4();
        const period = await this.periodRepository.getPeriodForDate(
          command.spentOn,
        );

        const expense = new Expense(
          id,
          period,
          new PLN(command.zloty, command.groszy),
          command.spentOn,
          command.category,
          command.label,
        );

        await this.repository.saveExpense(expense);
        resolve(expense);
      } catch (err) {
        reject(err);
      }
    });
  }
}
