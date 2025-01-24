import { v4 } from "uuid";
import { execute, fetchMany, fetchOne } from "..";
import type { Expense } from "../../types/expense";

export const listExpenses: () => Promise<Expense[]> = async () => {
  const sql: string = "SELECT * FROM expenses;";
  const params: any[] = [];

  return (await fetchMany(sql, params)) as Expense[];
};

const getExpense: (id: string) => Promise<Expense | null> = async (id) => {
  const sql: string = "SELECT * FROM expenses WHERE id = $1;";
  const params: any[] = [id];

  const result = await fetchOne(sql, params);
  if (result.length === 0) {
    return null;
  }
  return result as Expense;
};

type addExpenseInputType = {
  zloty: number;
  groszy: number;
  spentOn: Date;
  savedOn: Date;
  label: string;
  category: string;
};

export const addExpense: (o: addExpenseInputType) => Promise<Expense> = async ({
  zloty,
  groszy,
  category,
  label,
  spentOn,
  savedOn,
}) => {
  const id = v4();

  const sql: string =
    "INSERT INTO " +
    "expenses(id, zloty, groszy, category, label, spent_on, saved_on) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7);";
  const params: any[] = [id, zloty, groszy, category, label, spentOn, savedOn];

  await execute(sql, params);

  return getExpense(id);
};
