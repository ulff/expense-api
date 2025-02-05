import { InMemoryPeriodRepository } from "./InMemoryPeriodRepository";
import { InMemoryExpenseRepository } from "./InMemoryExpenseRepository";
import { Repository } from "../../domain/repository/Respository";

export class InMemoryRepository implements Repository {
  readonly periodRepository: InMemoryPeriodRepository;
  readonly expenseRepository: InMemoryExpenseRepository;

  constructor() {
    this.periodRepository = new InMemoryPeriodRepository();
    this.expenseRepository = new InMemoryExpenseRepository();
  }
}
