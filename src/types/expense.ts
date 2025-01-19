import { PLN } from "./PLN";
import { Category } from "./category";

export type Expense = {
  amount: PLN;
  spentOn: Date;
  category: Category;
  label: string | null;
};
