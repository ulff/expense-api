import { Expense } from "../../entity/Expense";
import { ExpenseRepository } from "../../repository/ExpenseRepository";
import { MissingExpenseError } from "../../error/MissingExpenseError";

export type GetPeriodByIdCommand = {
  id: string;
};

export class GetExpenseById {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public execute(command: GetPeriodByIdCommand): Promise<Expense> {
    return new Promise(async (resolve, reject) => {
      try {
        const expense = await this.repository.getExpense(command.id);
        if (!expense) {
          throw new MissingExpenseError(command.id);
        }
        resolve(expense);
      } catch (err) {
        reject(err);
      }
    });
  }
}
