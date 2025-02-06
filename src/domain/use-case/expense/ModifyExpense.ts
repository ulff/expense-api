import { Expense } from "../../entity/Expense";
import { PLN } from "../../entity/PLN";
import { CategoryName } from "../../entity/types/CategoryName";
import { ExpenseRepository } from "../../repository/ExpenseRepository";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { ExpenseValidator } from "../../validator/ExpenseValidator";
import { MissingExpenseError } from "../../error/MissingExpenseError";

export type ModifyExpenseCommand = {
  id: string;
  zloty: number;
  groszy: number;
  spentOn: Date;
  category: CategoryName;
  label?: string | null;
};

export class ModifyExpense {
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

  public execute(command: ModifyExpenseCommand): Promise<Expense> {
    return new Promise(async (resolve, reject) => {
      try {
        const expense = await this.repository.getExpense(command.id);
        if (!expense) {
          throw new MissingExpenseError(command.id);
        }

        ExpenseValidator.validateData(command);
        const period = await this.periodRepository.getPeriodForDate(
          command.spentOn,
        );

        expense.period = period;
        expense.amount = new PLN(command.zloty, command.groszy);
        expense.spentOn = command.spentOn;
        expense.category = command.category;
        expense.label = command.label;

        await this.repository.saveExpense(expense);
        resolve(expense);
      } catch (err) {
        reject(err);
      }
    });
  }
}
