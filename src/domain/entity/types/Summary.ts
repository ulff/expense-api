import { PLN } from "./PLN";
import { CategoryName } from "./CategoryName";

type CategorySpendings = {
  label: string;
  amount: PLN;
};

export type SummarySpendings = {
  [key in CategoryName]?: CategorySpendings;
};

export type Summary = {
  name: string;
  dateStart: Date;
  dateEnd: Date;
  categories: SummarySpendings;
};
