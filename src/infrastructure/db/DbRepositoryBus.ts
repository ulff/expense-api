import { DbPeriodRepository } from "./DbPeriodRepository";
import { DbExpenseRepository } from "./DbExpenseRepository";
import { RepositoryBus } from "../../domain/repository/RespositoryBus";

export class DbRepositoryBus implements RepositoryBus {
  readonly periodRepository: DbPeriodRepository;
  readonly expenseRepository: DbExpenseRepository;

  constructor() {
    this.periodRepository = new DbPeriodRepository();
    this.expenseRepository = new DbExpenseRepository();
  }
}
