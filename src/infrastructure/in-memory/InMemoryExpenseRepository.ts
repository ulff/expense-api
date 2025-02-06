import { ExpenseRepository } from "../../domain/repository/ExpenseRepository";
import { Expense } from "../../domain/entity/Expense";
import { Period } from "../../domain/entity/Period";

export class InMemoryExpenseRepository implements ExpenseRepository {
  private repository: { [key: string]: Expense };

  constructor() {
    this.repository = {};
  }

  saveExpense(expense: Expense): Promise<Expense> {
    return new Promise((resolve, reject) => {
      try {
        this.repository[expense.id] = expense;
        resolve(expense);
      } catch (err) {
        reject(err);
      }
    });
  }

  deleteExpense(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        delete this.repository[id];
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  getExpense(id: string): Promise<Expense | null> {
    return new Promise((resolve, reject) => {
      try {
        const expense = this.repository[id];
        if (!expense) {
          resolve(null);
        }
        resolve(expense);
      } catch (err) {
        reject(err);
      }
    });
  }

  listExpenses(period?: Period): Promise<Expense[]> {
    return new Promise((resolve, reject) => {
      try {
        const allExpenses = Object.values(this.repository);
        if (period) {
          const filtered = allExpenses.filter((e) => e.period.id === period.id);
          resolve(filtered);
        } else {
          resolve(allExpenses);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
