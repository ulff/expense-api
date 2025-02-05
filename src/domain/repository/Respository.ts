import { PeriodRepository } from "./PeriodRepository";
import { ExpenseRepository } from "./ExpenseRepository";

export interface Repository {
  readonly periodRepository: PeriodRepository;
  readonly expenseRepository: ExpenseRepository;
}
