import { Period } from "../../entity/Period";
import { PeriodRepository } from "../../repository/PeriodRepository";

export class ListAllPeriods {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public execute(): Promise<Period[]> {
    return new Promise((resolve, reject) => {
      try {
        const periods = this.repository.listPeriods();
        resolve(periods);
      } catch (err) {
        reject(err);
      }
    });
  }
}
