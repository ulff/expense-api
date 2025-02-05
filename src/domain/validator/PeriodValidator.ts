import { Period } from "../model/Period";
import { PeriodRepository } from "../repository/PeriodRepository";
import { ModifyPeriodCommand } from "../use-case/period/ModifyPeriod";
import { AddPeriodCommand } from "../use-case/period/AddPeriod";

import { InvalidDateRangeError } from "./error/period/InvalidDateRangeError";
import { DatesCollisionError } from "./error/period/DatesCollisionError";
import { EmptyFieldError } from "./error/EmptyFieldError";

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

export class PeriodValidator {
  private readonly repository: PeriodRepository;

  constructor(repository: PeriodRepository) {
    this.repository = repository;
  }

  public static validateData(
    command: ModifyPeriodCommand | AddPeriodCommand,
  ): void {
    if (!command.name) {
      throw new EmptyFieldError("name");
    }

    if (!command.dateStart) {
      throw new EmptyFieldError("dateStart");
    }

    if (!command.dateEnd) {
      throw new EmptyFieldError("dateEnd");
    }

    if (command.dateStart > command.dateEnd) {
      throw new InvalidDateRangeError();
    }

    // todo: check both dates formats
    // todo: one day difference at least

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
          reject(new DatesCollisionError());
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
