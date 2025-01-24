import { PLN } from "./PLN";
import { Category } from "./category";
import { Period } from "./period";

export type Expense = {
  id: string;
  period: Period;
  amount: PLN;
  spentOn: Date;
  category: Category;
  label: string | null;
};
