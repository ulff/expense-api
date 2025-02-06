import { Period } from "./Period";
import { PLN } from "./PLN";
import { CategoryName } from "./types/CategoryName";

export class Expense {
  public readonly id: string;
  public period: Period;
  public amount: PLN;
  public spentOn: Date;
  public category: CategoryName;
  public label: string | null;

  constructor(
    id: string,
    period: Period,
    amount: PLN,
    spentOn: Date,
    category: CategoryName,
    label?: string,
  ) {
    this.id = id;
    this.period = period;
    this.amount = amount;
    this.spentOn = spentOn;
    this.category = category;
    this.label = label;
  }
}
