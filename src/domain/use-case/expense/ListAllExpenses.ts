import { Expense } from "../../entity/Expense";
import { ExpenseRepository } from "../../repository/ExpenseRepository";

export class ListAllExpenses {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public execute(): Promise<Expense[]> {
    return new Promise((resolve, reject) => {
      try {
        const expenses = this.repository.listExpenses();
        resolve(expenses);
      } catch (err) {
        reject(err);
      }
    });
  }
}
