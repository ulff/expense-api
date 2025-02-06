import { ExpenseRepository } from "../../repository/ExpenseRepository";

export type DeleteExpenseCommand = {
  id: string;
};

export class DeleteExpense {
  private readonly repository: ExpenseRepository;

  constructor(repository: ExpenseRepository) {
    this.repository = repository;
  }

  public execute(command: DeleteExpenseCommand): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.repository.deleteExpense(command.id);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
