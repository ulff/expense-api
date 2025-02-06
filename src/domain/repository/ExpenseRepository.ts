import { Expense } from "../entity/Expense";
import { Period } from "../entity/Period";

export interface ExpenseRepository {
  saveExpense(period: Expense): Promise<Expense>;
  listExpenses(period?: Period): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | null>;
  deleteExpense(id: string): Promise<void>;
}
