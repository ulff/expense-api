import { Expense } from "../entity/Expense";
import { Period } from "../entity/Period";

export interface ExpenseRepository {
  /**
   * Saves the Expense entity, used for both creating and modifying.
   */
  saveExpense(period: Expense): Promise<Expense>;

  /**
   * Returns a plain list of Expenses for given Period, or all Expenses if no Period is provided..
   */
  listExpenses(period?: Period): Promise<Expense[]>;

  /**
   * Returns a single Expense instance by its ID.
   */
  getExpense(id: string): Promise<Expense | null>;

  /**
   * Removes given Expense by its ID.
   */
  deleteExpense(id: string): Promise<void>;
}
