import { Period } from "../../model/Period";
import { Expense } from "../../model/Expense";
import { ExpenseRepository } from "../../repository/ExpenseRepository";

export type ListExpensesForPeriodCommand = {
  period: Period;
};

export class ListExpensesForPeriod {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public execute(command: ListExpensesForPeriodCommand): Promise<Expense[]> {
    return new Promise((resolve, reject) => {
      try {
        const expenses = this.repository.listExpenses(command.period);
        resolve(expenses);
      } catch (err) {
        reject(err);
      }
    });
  }
}
