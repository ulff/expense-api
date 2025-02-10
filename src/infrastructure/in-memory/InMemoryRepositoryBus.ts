import { InMemoryPeriodRepository } from "./InMemoryPeriodRepository";
import { InMemoryExpenseRepository } from "./InMemoryExpenseRepository";
import { RepositoryBus } from "../../domain/repository/RespositoryBus";

export class InMemoryRepositoryBus implements RepositoryBus {
  readonly periodRepository: InMemoryPeriodRepository;
  readonly expenseRepository: InMemoryExpenseRepository;

  constructor() {
    this.periodRepository = new InMemoryPeriodRepository();
    this.expenseRepository = new InMemoryExpenseRepository();
  }
}
