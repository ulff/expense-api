import { Expense } from "../model/Expense";
import { Period } from "../model/Period";

export interface ExpenseRepository {
  saveExpense(period: Expense): Promise<Expense>;
  listExpenses(period?: Period): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | null>;
  deleteExpense(id: string): Promise<void>;
}
