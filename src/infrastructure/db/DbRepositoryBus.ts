import { DbConnection } from "./DbConnection";

import { RepositoryBus } from "../../domain/repository/RespositoryBus";
import { DbPeriodRepository } from "./DbPeriodRepository";
import { DbExpenseRepository } from "./DbExpenseRepository";

export class DbRepositoryBus implements RepositoryBus {
  readonly periodRepository: DbPeriodRepository;
  readonly expenseRepository: DbExpenseRepository;

  readonly connection: DbConnection;

  constructor() {
    this.connection = new DbConnection();

    this.periodRepository = new DbPeriodRepository(this.connection);
    this.expenseRepository = new DbExpenseRepository(this.connection);
  }
}
