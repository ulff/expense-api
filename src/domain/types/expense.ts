import { PLN } from "./PLN";
import { CategoryName } from "./category";
import { Period } from "./period";

export type Expense = {
  id: string;
  period: Period;
  amount: PLN;
  spentOn: Date;
  category: CategoryName;
  label: string | null;
};
