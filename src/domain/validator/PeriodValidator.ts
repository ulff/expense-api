import { Period } from "../entity/Period";
import { PeriodRepository } from "../repository/PeriodRepository";
import { ModifyPeriodCommand } from "../use-case/period/ModifyPeriod";
import { AddPeriodCommand } from "../use-case/period/AddPeriod";

import { InvalidDateRangeValidationError } from "./error/InvalidDateRangeValidationError";
import { DatesCollisionValidationError } from "./error/DatesCollisionValidationError";
import { EmptyFieldValidationError } from "./error/EmptyFieldValidationError";
import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";

const filterIntersected = (p1: Period, p2: Period): boolean => {
  return startsInside(p1, p2) || endsInside(p1, p2) || encloses(p1, p2);
};

const startsInside = (p1: Period, p2: Period): boolean => {
  return p1.dateStart >= p2.dateStart && p1.dateStart <= p2.dateEnd;
};

const endsInside = (p1: Period, p2: Period): boolean => {
  return p1.dateEnd >= p2.dateStart && p1.dateEnd <= p2.dateEnd;
};

const encloses = (p1: Period, p2: Period): boolean => {
  return p1.dateStart <= p2.dateStart && p1.dateEnd >= p2.dateEnd;
};

type PeriodInput = {
  id?: string;
  dateStart: string;
  dateEnd: string;
  name: string;
};

export class PeriodValidator {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public static createPeriodCommand(
    input: PeriodInput,
  ): AddPeriodCommand | ModifyPeriodCommand {
    if (input.id) {
      return {
        id: input.id,
        dateStart: new Date(input.dateStart),
        dateEnd: new Date(input.dateEnd),
        name: input.name,
      } as ModifyPeriodCommand;
    }

    return {
      dateStart: new Date(input.dateStart),
      dateEnd: new Date(input.dateEnd),
      name: input.name,
    } as AddPeriodCommand;
  }

  public static validateData(
    command: ModifyPeriodCommand | AddPeriodCommand,
  ): void {
    if (!command.dateStart || isNaN(command.dateStart.getTime())) {
      throw new InvalidFieldValidationError("dateStart");
    }

    if (!command.dateEnd || isNaN(command.dateEnd.getTime())) {
      throw new InvalidFieldValidationError("dateEnd");
    }

    if (!command.name) {
      throw new EmptyFieldValidationError("name");
    }

    if (command.dateStart > command.dateEnd) {
      throw new InvalidDateRangeValidationError();
    }

    return;
  }

  public checkCollisions(period: Period): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const otherPeriods = await this.repository.listPeriods();
        const conflicted = otherPeriods
          .filter((p: Period) => p.id !== period.id)
          .filter((p: Period) => filterIntersected(period, p));
        if (conflicted.length > 0) {
          reject(new DatesCollisionValidationError());
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
