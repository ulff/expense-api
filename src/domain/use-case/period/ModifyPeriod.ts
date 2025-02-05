import { Period } from "../../model/Period";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { PeriodValidator } from "../../validator/PeriodValidator";
import { MissingPeriodError } from "../../validator/error/period/MissingPeriodError";

export type ModifyPeriodCommand = {
  id: string;
  dateStart: Date;
  dateEnd: Date;
  name: string;
};

export class ModifyPeriod {
  private readonly repository: PeriodRepository;
  private readonly validator: PeriodValidator;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
    this.validator = new PeriodValidator(repository);
  }

  public execute(command: ModifyPeriodCommand): Promise<Period> {
    return new Promise(async (resolve, reject) => {
      try {
        const period = await this.repository.getPeriod(command.id);
        if (!period) {
          throw new MissingPeriodError(command.id);
        }

        PeriodValidator.validateData(command);

        period.dateStart = new Date(command.dateStart);
        period.dateEnd = new Date(command.dateEnd);
        period.name = command.name;

        await this.validator.checkCollisions(period);

        await this.repository.savePeriod(period);
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }
}
