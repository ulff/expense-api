import { Expense } from "../../entity/Expense";
import { PLN } from "../../entity/types/PLN";
import { Period } from "../../entity/Period";
import { Category } from "../../entity/types/Category";
import { CategoryName } from "../../entity/types/CategoryName";
import { Summary, SummarySpendings } from "../../entity/types/Summary";

export type PrepareSummaryForPeriodCommand = {
  period: Period;
  expenses: Expense[];
  categories: {
    [key in CategoryName]?: Category;
  };
};

export class PrepareSummaryForPeriod {
  constructor() {}

  public execute(command: PrepareSummaryForPeriodCommand): Summary {
    const summaryIndex: SummarySpendings = {};

    const calculated: SummarySpendings = command.expenses.reduce(
      (acc: SummarySpendings, expense: Expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = {
            label: command.categories[expense.category as CategoryName].label,
            amount: expense.amount,
          };
        } else {
          acc[expense.category].amount = PLN.sumPLN(
            acc[expense.category].amount,
            expense.amount,
          );
        }

        return acc;
      },
      summaryIndex,
    );

    const total: PLN = command.expenses.reduce(
      (acc: PLN, expense: Expense) => {
        return PLN.sumPLN(acc, expense.amount);
      },
      new PLN(0, 0),
    );

    const summary: Summary = {
      name: command.period.name,
      dateStart: command.period.dateStart,
      dateEnd: command.period.dateEnd,
      categories: calculated,
      total,
    };

    return summary;
  }
}
