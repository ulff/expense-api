import { Period } from "../entity/Period";

export interface PeriodRepository {
  /**
   * Saves the Period entity, used for both creating and modifying.
   */
  savePeriod(period: Period): Promise<Period>;

  /**
   * Returns a plain list of all Periods.
   */
  listPeriods(): Promise<Period[]>;

  /**
   * Returns a single Period instance by its ID.
   */
  getPeriod(id: string): Promise<Period | null>;

  /**
   * Returns a single Period instance for given Date
   * @throws {MissingPeriodForDateError} When there is no Period created for given Date.
   */
  getPeriodForDate(date: Date): Promise<Period>;

  /**
   * Removes given Period by its ID.
   */
  deletePeriod(id: string): Promise<void>;
}
