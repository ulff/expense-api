import { Summary, SummaryIndex, SummaryInput } from "../types/summary";
import { CategoryName } from "../types/category";
import { sumPLN } from "../types/PLN";
import { Expense } from "../types/expense";

const prepareSummary: ({
  period,
  expenses,
  categories,
}: SummaryInput) => Summary = ({ period, expenses, categories }) => {
  console.log("period", period);
  console.log("-------------------------");
  console.log("expenses", expenses);
  console.log("-------------------------");
  console.log("categories", categories);

  const summaryIndex: SummaryIndex = {};

  const calculated: SummaryIndex = expenses.reduce(
    (acc: SummaryIndex, expense: Expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = {
          label: categories[expense.category as CategoryName].label,
          amount: expense.amount,
        };
      } else {
        acc[expense.category].amount = sumPLN(
          acc[expense.category].amount,
          expense.amount,
        );
      }

      return acc;
    },
    summaryIndex,
  );

  const summary: Summary = {
    name: period.name,
    dateStart: period.dateStart,
    dateEnd: period.dateEnd,
    categories: calculated,
  };

  return summary;
};

export { prepareSummary };
