import { PLN } from "../PLN";
import { Period } from "../Period";
import { Expense } from "../Expense";
import { Category } from "./Category";
import { CategoryName } from "./CategoryName";

export type SummaryInput = {
  period: Period;
  expenses: Expense[];
  categories: {
    [key in CategoryName]?: Category;
  };
};

type CategorySpendings = {
  label: string;
  amount: PLN;
};

export type SummaryIndex = {
  [key in CategoryName]?: CategorySpendings;
};

export type Summary = {
  name: string;
  dateStart: Date;
  dateEnd: Date;
  categories: SummaryIndex;
};
