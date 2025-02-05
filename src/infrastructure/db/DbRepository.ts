import { DbPeriodRepository } from "./DbPeriodRepository";
import { DbExpenseRepository } from "./DbExpenseRepository";
import { Repository } from "../../domain/repository/Respository";

export class DbRepository implements Repository {
  readonly periodRepository: DbPeriodRepository;
  readonly expenseRepository: DbExpenseRepository;

  constructor() {
    this.periodRepository = new DbPeriodRepository();
    this.expenseRepository = new DbExpenseRepository();
  }
}
