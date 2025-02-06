import { PeriodRepository } from "../../repository/PeriodRepository";

export type DeletePeriodCommand = {
  id: string;
};

export class DeletePeriod {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public execute(command: DeletePeriodCommand): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.repository.deletePeriod(command.id);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
