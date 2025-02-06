import { Period } from "../../entity/Period";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { MissingPeriodForDateError } from "../../error/MissingPeriodForDateError";

export class GetCurrentPeriod {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public execute(): Promise<Period> {
    return new Promise(async (resolve, reject) => {
      try {
        const now = new Date();
        const period = await this.repository.getPeriodForDate(now);
        if (!period) {
          throw new MissingPeriodForDateError(now);
        }
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }
}
