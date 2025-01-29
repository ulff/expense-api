import { v4 } from "uuid";
import { execute, fetchMany, fetchOne } from "..";
import type { Expense } from "../../domain/types/expense";
import type { Period } from "../../domain/types/period";
import { CategoryName } from "../../domain/types/category";

const listExpenses: (period?: Period) => Promise<Expense[]> = async (
  period,
) => {
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

  return results.map((result) => ({
    id: result.id,
    period: {
      id: result.period,
      dateStart: new Date(result.date_start),
      dateEnd: new Date(result.date_end),
      name: result.period_name,
    },
    amount: {
      zloty: result.zloty,
      groszy: result.groszy,
    },
    spentOn: new Date(result.spent_on),
    category: result.category as CategoryName,
    label: result.label,
  }));
};

const getExpense: (id: string) => Promise<Expense | null> = async (id) => {
  const sql = `
    SELECT e.*, 
           p.date_start, p.date_end, p.name AS period_name 
    FROM expenses e
    JOIN periods p ON e.period = p.id
    WHERE e.id = $1;
  `;
  const params: any[] = [id];

  const result = await fetchOne(sql, params);
  if (!result) {
    return null;
  }

  return {
    id: result.id,
    period: {
      id: result.period,
      dateStart: new Date(result.date_start),
      dateEnd: new Date(result.date_end),
      name: result.period_name,
    },
    amount: {
      zloty: result.zloty,
      groszy: result.groszy,
    },
    spentOn: new Date(result.spent_on),
    category: result.category as CategoryName,
    label: result.label,
  };
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
    "SET period = $2, zloty = $3, groszy = $4, category = $5, label = $6, spent_on = $7, saved_on = $8 " +
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

export { listExpenses, addExpense, updateExpense };
