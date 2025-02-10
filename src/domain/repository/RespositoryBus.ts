import { PeriodRepository } from "./PeriodRepository";
import { ExpenseRepository } from "./ExpenseRepository";

export interface RepositoryBus {
  readonly periodRepository: PeriodRepository;
  readonly expenseRepository: ExpenseRepository;
}
