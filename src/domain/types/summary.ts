import { PLN } from "./PLN";
import { Period } from "./period";
import { Expense } from "./expense";
import { Category, CategoryName } from "./category";

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
