import { v4 } from "uuid";
import { execute, fetchMany, fetchOne } from "..";
import type { Expense } from "../../domain/types/expense";
import { Period } from "../../domain/types/period";

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
  period: Period;
  zloty: number;
  groszy: number;
  spentOn: Date;
  label: string;
  category: string;
};

const addExpense: (o: addExpenseInputType) => Promise<Expense> = async ({
  period,
  zloty,
  groszy,
  category,
  label,
  spentOn,
}) => {
  const id = v4();
  const savedOn = new Date();

  const sql: string =
    "INSERT INTO " +
    "expenses(id, period, zloty, groszy, category, label, spent_on, saved_on) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
  const params: any[] = [
    id,
    period.id,
    zloty,
    groszy,
    category,
    label,
    spentOn,
    savedOn,
  ];

  await execute(sql, params);

  return getExpense(id);
};

type updateExpenseInputType = {
  expenseId: string;
} & addExpenseInputType;

const updateExpense: (o: updateExpenseInputType) => Promise<Expense> = async ({
  expenseId,
  period,
  zloty,
  groszy,
  category,
  label,
  spentOn,
}) => {
  const savedOn = new Date();

  const sql: string =
    "UPDATE expenses " +
    "SET period = $1, zloty = $3, groszy = $4, category = $5, label = $6, spent_on = $7, saved_on = $8 " +
    "WHERE (id = $1);";
  const params: any[] = [
    expenseId,
    period.id,
    zloty,
    groszy,
    category,
    label,
    spentOn,
    savedOn,
  ];

  await execute(sql, params);

  return getExpense(expenseId);
};

export { addExpense, updateExpense };
