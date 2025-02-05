import { Expense } from "../../model/Expense";
import { PLN } from "../../model/PLN";
import { Period } from "../../model/Period";
import { Category } from "../../model/types/Category";
import { CategoryName } from "../../model/types/CategoryName";
import { Summary, SummaryIndex } from "../../model/types/Summary";

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
    const summaryIndex: SummaryIndex = {};

    const calculated: SummaryIndex = command.expenses.reduce(
      (acc: SummaryIndex, expense: Expense) => {
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

    const summary: Summary = {
      name: command.period.name,
      dateStart: command.period.dateStart,
      dateEnd: command.period.dateEnd,
      categories: calculated,
    };

    return summary;
  }
}
