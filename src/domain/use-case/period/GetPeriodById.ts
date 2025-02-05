import { Period } from "../../model/Period";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { MissingPeriodError } from "../../validator/error/period/MissingPeriodError";

export type GetPeriodByIdCommand = {
  id: string;
};

export class GetPeriodById {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public execute(command: GetPeriodByIdCommand): Promise<Period> {
    return new Promise(async (resolve, reject) => {
      try {
        const period = await this.repository.getPeriod(command.id);
        if (!period) {
          throw new MissingPeriodError(command.id);
        }
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }
}
