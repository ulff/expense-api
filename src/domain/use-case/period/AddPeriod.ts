import { v4 as Uuidv4 } from "uuid";

import { Period } from "../../entity/Period";
import { PeriodRepository } from "../../repository/PeriodRepository";
import { PeriodValidator } from "../../validator/PeriodValidator";

export type AddPeriodCommand = {
  dateStart: Date;
  dateEnd: Date;
  name: string;
};

export class AddPeriod {
  private readonly repository: PeriodRepository;
  private readonly validator: PeriodValidator;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
    this.validator = new PeriodValidator(repository);
  }

  public execute(command: AddPeriodCommand): Promise<Period> {
    return new Promise(async (resolve, reject) => {
      try {
        PeriodValidator.validateData(command);

        const id: string = Uuidv4();
        const period = new Period(
          id,
          new Date(command.dateStart),
          new Date(command.dateEnd),
          command.name,
        );

        await this.validator.checkCollisions(period);
        await this.repository.savePeriod(period);
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }
}
