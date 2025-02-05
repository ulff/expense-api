import { execute, fetchOne, fetchMany } from "./core";
import { Expense } from "../../domain/model/Expense";
import { ExpenseRepository } from "../../domain/repository/ExpenseRepository";
import { Period } from "../../domain/model/Period";
import { PLN } from "../../domain/model/PLN";
import { CategoryName } from "../../domain/model/types/CategoryName";

export class DbExpenseRepository implements ExpenseRepository {
  constructor() {}
  async saveExpense(expense: Expense): Promise<Expense> {
    const sql: string = `
      INSERT INTO 
      expenses(
        id, 
        period, 
        zloty, 
        groszy, 
        category, 
        label, 
        spent_on, 
        saved_on
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      ON CONFLICT ON CONSTRAINT expenses_pkey DO 
      UPDATE SET 
        period = EXCLUDED.period, 
        zloty = EXCLUDED.zloty, 
        groszy = EXCLUDED.groszy, 
        category = EXCLUDED.CATEGORY, 
        label = EXCLUDED.label, 
        spent_on = EXCLUDED.spent_on, 
        saved_on = EXCLUDED.saved_on 
      WHERE (expenses.id = EXCLUDED.id);
    `;

    const params: any[] = [
      expense.id,
      expense.period.id,
      expense.amount.zloty,
      expense.amount.groszy,
      expense.category,
      expense.label,
      expense.spentOn,
      new Date(),
    ];

    await execute(sql, params);

    return this.getExpense(expense.id);
  }

  async deleteExpense(id: string): Promise<void> {
    const sql: string = `DELETE FROM expenses WHERE id = $1;`;
    const params: any[] = [id];

    await execute(sql, params);

    return;
  }

  async getExpense(id: string): Promise<Expense | null> {
    const sql: string = `
      SELECT e.*, 
             p.date_start, p.date_end, p.name AS period_name 
      FROM expenses e
      JOIN periods p ON e.period = p.id
      WHERE e.id = $1;
    `;
    const params: any[] = [id];

    const result = await fetchOne(sql, params);
    if (result.length === 0) {
      return null;
    }

    const expense = new Expense(
      result.id,
      new Period(
        result.period,
        new Date(result.date_start),
        new Date(result.date_end),
        result.period_name,
      ),
      new PLN(result.zloty, result.groszy),
      new Date(result.spent_on),
      result.category as CategoryName,
      result.label,
    );

    return expense;
  }

  async listExpenses(period?: Period): Promise<Expense[]> {
    let sql = `
      SELECT e.*, 
             p.date_start, p.date_end, p.name AS period_name 
      FROM expenses e
      JOIN periods p ON e.period = p.id
    `;
    const params: any[] = [];

    if (period) {
      sql += "WHERE e.period = $1 ";
      params.push(period.id);
    }

    sql += "ORDER BY e.spent_on DESC;";

    const results = await fetchMany(sql, params);
    if (!results || results.length === 0) {
      return [];
    }

    return results.map(
      (result) =>
        new Expense(
          result.id,
          new Period(
            result.period,
            new Date(result.date_start),
            new Date(result.date_end),
            result.period_name,
          ),
          new PLN(result.zloty, result.groszy),
          new Date(result.spent_on),
          result.category as CategoryName,
          result.label,
        ),
    );
  }
}
