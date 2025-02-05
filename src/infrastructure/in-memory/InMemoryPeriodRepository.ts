import { Period } from "../../domain/model/Period";
import { PeriodRepository } from "../../domain/repository/PeriodRepository";
import { MissingPeriodForDateError } from "../../domain/validator/error/expense/MissingPeriodForDateError";

export class InMemoryPeriodRepository implements PeriodRepository {
  private repository: { [key: string]: Period };

  constructor() {
    this.repository = {};
  }

  savePeriod(period: Period): Promise<Period> {
    return new Promise((resolve, reject) => {
      try {
        this.repository[period.id] = period;
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }

  deletePeriod(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        delete this.repository[id];
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  getPeriod(id: string): Promise<Period | null> {
    return new Promise((resolve, reject) => {
      try {
        const period = this.repository[id];
        if (!period) {
          resolve(null);
        }
        resolve(period);
      } catch (err) {
        reject(err);
      }
    });
  }

  getPeriodForDate(date: Date): Promise<Period> {
    return new Promise((resolve, reject) => {
      try {
        const now = new Date();
        const allPeriods = Object.values(this.repository);
        const filtered = allPeriods.filter(
          (p) => p.dateStart < now && p.dateEnd > now,
        );
        if (filtered.length == 0) {
          throw new MissingPeriodForDateError(now);
        }
        resolve(filtered[0]);
      } catch (err) {
        reject(err);
      }
    });
  }

  listPeriods(): Promise<Period[]> {
    return new Promise((resolve, reject) => {
      try {
        const periods = Object.values(this.repository);
        resolve(periods);
      } catch (err) {
        reject(err);
      }
    });
  }
}
